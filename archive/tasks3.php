<?php
$title = "Tasks";
$username = "Angella"; // this will appear in the bottom of the sidebar. Eventually should be managed by session variables
$active = "tasks";
?>

<!DOCTYPE html>
<html lang='en'>
<head>
  <?php require 'components/metadata.php'; ?>
</head>
<body>
<!-- navbar -->
<?php require 'components/nav.php'; ?>

<header>
  <h1 class="page-title">My Tasks</h1>
</header>

<!-- middle area -->
<main>
  <!-- filter bar -->
  <section>
    <div id="filterbar">
      Filter by group:
      <span id="options">
					<a href="tasks.php" class="filter-group ">ALL</a>
					<a href="tasks1.php" class="filter-group">ITP 460</a>
					<a href="tasks2.php" class="filter-group">WRIT 340</a>
					<a href="tasks3.php" class="filter-group selected">SOCCER CLUB</a>
				</span> <!-- #options -->
    </div> <!-- #filterbar -->
  </section>

  <hr/>

  <!-- kanban -->
  <section>
    <div id="kanban">
      <div id="not-started">
        <button class="num-circle" disabled>4</button>
        <h2>Not Started</h2>
        <div class="clear-float"></div>


        <!-- card 4 -->
        <div class="card color-band-soccerclub">
          <h3 class="card-team card-team-soccerclub">SOCCER CLUB</h3>
          <h2 class="card-heading">Plan bake sale fundraiser for new uniforms</h2>
          <div class="card-icons">
            <div class="icon-group"><i class="fas fa-user-circle"></i> 11</div>
            <div class="icon-group"><i class="fas fa-comment"></i> 1</div>
            <div class="icon-group"><i class="fas fa-clock"></i> 6 days</div>
          </div>
        </div>

      </div> <!-- #not-started -->

      <div id="in-progress">
        <button class="num-circle" disabled>1</button>
        <h2>In Progress</h2>
        <div class="clear-float"></div>

        <!-- card 1 -->
        <div class="card color-band-soccerclub">
          <h3 class="card-team card-team-soccerclub">SOCCER CLUB</h3>
          <h2 class="card-heading">Fill out player agreement form and email it to Jane</h2>
          <div class="card-icons">
            <div class="icon-group"><i class="fas fa-user-circle"></i> 1</div>
            <div class="icon-group"><i class="fas fa-comment"></i> 0</div>
            <div class="icon-group red"><i class="fas fa-clock"></i> yesterday</div>
          </div>
        </div>
      </div> <!-- #in-progress -->

      <div id="complete">
        <button class="num-circle" disabled>2</button>
        <h2>Complete</h2>
        <div class="clear-float"></div>


      </div> <!-- #complete -->

      <div class="clear-float"></div>
    </div> <!-- #kanban -->
  </section>
</main>

</body>
