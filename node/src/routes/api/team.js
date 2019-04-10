require('dotenv').config();
const log = require('../../util/log')
const router = require('express').Router();
const mongoose = require('mongoose');
const Team = mongoose.model('Team');
const User = mongoose.model('User');
const Invitation = mongoose.model('Invitation');
const auth = require('../auth');

const TEAM_NONEXISTENT_MSG = "Team does not exist, or user doesn't have permission to access this team";

// always perform auth check
router.use(auth.required, async function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (!user) {
      return res.sendStatus(401);
    }
    req.locals = {};
    req.locals.user = user;
    next();
  })
});


// Get all Teams
router.get("/", async (req, res) => {
  const user = req.locals.user;
  Team.find({members: user.id})
    .populate('members').populate('invitations')
    .then((teams) => {
      res.json({"teams": teams});
    });
});


// Create a Team
router.post("/", async (req, res, next) => {
  const user = req.locals.user;
  log.log('Creating a team');
  const req_team = req.body.team;
  if (!req_team) {
    return res.status(422).json({
      errors: {
        message: "no team field"
      }
    });
  }
  // required fields: name, color
  if (!req_team.name) {
    return res.status(422).json({
      errors: {
        message: "name can't be blank"
      }
    });
  }
  if (!req_team.color) {
    return res.status(422).json({
      errors: {
        message: "color can't be blank"
      }
    });
  }
  // build the team
  const team = new Team();
  team.name = req_team.name;
  team.color = req_team.color;
  // only update fields that were actually passed...
  if (typeof req_team.description !== 'undefined') {
    team.description = req_team.description
  }
  // add the creator to the team
  team.members = [];
  team.members.push(user.id);

  team.save().then(() => {
    log.log(`Team (${team.name}) created`);
    return res.json({team: team});
  }).catch(next);
});


// Update Team
router.put("/:t_id", auth.required, async (req, res) => {
  const user = req.locals.user;
  Team.findOne({_id: req.params['t_id'], members: mongoose.Types.ObjectId(user.id)})
    .then(function (team) {
      if (!team) {
        return res.status(422).json({
          errors: {
            message: TEAM_NONEXISTENT_MSG
          }
        });
      }
      const req_team = req.body.team;
      // only update fields that were actually passed...
      if (typeof req_team.name !== 'undefined') {
        team.name = req_team.name
      }
      if (typeof req_team.description !== 'undefined') {
        team.description = req_team.description
      }
      team.save().then(() => {
        log.log(`Team (${team.name}) modified`);
        return res.json({team: team});
      })
    }).catch(function () {
    return res.status(422).json({
      errors: {
        message: TEAM_NONEXISTENT_MSG
      }
    });
  })
});


router.delete("/:t_id", async (req, res) => {
  const user = req.locals.user;
  Team.findOneAndDelete({_id: req.params['t_id'], members: mongoose.Types.ObjectId(user.id)})
    .then(function (team) {
      if (!team) {
        return res.status(422).json({
          errors: {
            message: TEAM_NONEXISTENT_MSG
          }
        });
      } else {
        log.log(`Team (${team.name}) deleted`);
        res.json({team: team});
      }
    }).catch(function () {
    return res.status(422).json({
      errors: {
        message: TEAM_NONEXISTENT_MSG
      }
    });
  })
});


// invite new members
router.post('/:t_id/invite', async (req, res) => {
  const user = req.locals.user;
  Team.findOne({_id: req.params['t_id'], members: mongoose.Types.ObjectId(user.id)})
    .then(function (team) {
      if (!team) {
        return res.status(422).json({
          errors: {
            message: TEAM_NONEXISTENT_MSG
          }
        });
      }
      const req_emails = req.body.emails;
      if (!req_emails) return res.status(422).json({
        errors: {
          message: 'No Emails field'
        }
      });
      const sgMail = require('@sendgrid/mail');
      for (const email of req_emails) {
        const invitation = new Invitation({
          email: email,
          team: team._id,
          code: Invitation.generateCode(team.name)
        });

        const msg = {
          "from": {
            "name": "Mars Tan",
            "email": "jianxuat@usc.edu"
          },
          "personalizations": [
            {
              "to": [
                {
                  "name": email,
                  "email": email
                }
              ],
              "dynamic_template_data": {
                "team": team,
                "invite_code": process.env.FRONT_URL + "/?invite="+invitation.code,
                "inviter": user
              }
            }
          ],
          "template_id": process.env.INVITATION_TEMPLATE
        };
        sgMail.send(msg).catch(error => log.error(error));
        team.invitations.push(invitation._id);
        invitation.save();
      }
      team.save().then(function () {
        return res.json({team: team});
      });

    }).catch(function () {
    return res.status(422).json({
      errors: {
        message: TEAM_NONEXISTENT_MSG
      }
    });
  })
});


// invite new members
router.get('/join/:invite', async (req, res) => {
  const user = req.locals.user;
  Invitation.findOneAndDelete({code: req.params['invite'], email: user.email})
    .then(function (invitation) {
      if (!invitation) {
        return res.status(422).json({
          errors: {
            message: TEAM_NONEXISTENT_MSG
          }
        });
      }
      Team.findById(invitation.team).then(team => {
        team.members.push(user._id);
        team.save().then(function () {
          return res.json({team: team});
        });
      })
    }).catch(function () {
    return res.status(422).json({
      errors: {
        message: TEAM_NONEXISTENT_MSG
      }
    });
  })
});


module.exports = router;
