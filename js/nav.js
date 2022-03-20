"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
  if (currentUser) {
    $navLinks.show()
  }
}

$body.on("click", "#nav-all", navAllStories);

/* Allow user to add a story */

function navSubmitStoryClick(evt) {
  console.debug("navSubmitClick", evt);
  hidePageComponents();
  $allStoriesList.show();
  $submitStoryForm.show();
  $navLinks.show()
}

$navSubmit.on("click", navSubmitStoryClick);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $navLogin.hide();
  $navLinks.show();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** When a user clicks on favorites in the navbar, show a list of the stories they've marked as favorites */

function showFaves(evt) {
  hidePageComponents();
  showFavesList();
  $favStories.show()
  $navLinks.show()
}

$navFav.on("click", showFaves);

function showUserStories(evt) {
  hidePageComponents();
  showUserStories();
  $userStories.show()
  $navLinks.show()
}

$navUserStories.on("click", showUserStories);