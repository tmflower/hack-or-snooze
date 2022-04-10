"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {

  let heart;
  if (currentUser.favorites.includes(story)) {
    heart = "fas";
  }
  else {
    heart = "far";
  }

  let trash;
  if (currentUser.ownStories.includes(story)) {
          trash = "fas fa-trash"
  }
  else {
    trash = ""
  }

  

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <span class="heart">        
        <i class="fa-thin fa-heart  ${heart}"></i>
        </span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <span class="trash">
        <i class="${trash}"></i>
        </span>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);   
    $allStoriesList.append($story);
  }
  $allStoriesList.show();
}

async function getAndAddNewStory() {
  const username = currentUser.username;
  const author = $("#author-input").val();
  const title = $("#title-input").val();
  const url = $("#url-input").val();
  const myNewStory = await storyList.addStory(currentUser, {title, author, url, username});
  const $myNewStory = generateStoryMarkup(myNewStory);
  $allStoriesList.prepend($myNewStory);
  putStoriesOnPage()
}

$submitStoryBtn.on('click', function(evt) {
  evt.preventDefault();
  getAndAddNewStory();
})

async function trashStory(evt) {
  const $closestLi = $(evt.target).closest('li');
  const storyId = $closestLi.attr('id');
  await storyList.deleteStory(currentUser, storyId);
  let idx = currentUser.ownStories.indexOf($closestLi);
  currentUser.ownStories.splice(idx, 1);
  putStoriesOnPage();
  location.reload();
}

$userStories.on('click', '.fas.fa-trash', trashStory);

function showUserStories() {
  $userStories.empty();
  if (currentUser.ownStories.length === 0) {
    $userStories.append('<h4>No stories added!</h4>');
  }
  else {
    for (let story of currentUser.ownStories) {
      const $story = generateStoryMarkup(story);
      $userStories.append($story);
    }
  }
  $userStories.show();
}

async function markFave(evt) {
  const $heart = $(evt.target);
  const $closestLi = $heart.closest('li');
  const storyId = $closestLi.attr('id');
  const story = storyList.stories.find(s => s.storyId === storyId);
  await currentUser.addFavStory(story);
  $heart.closest('i').toggleClass('fas far');
}

$allStoriesList.on('click', '.fa-thin.fa-heart.far', markFave);


async function unmarkFave(evt) {
  const $heart = $(evt.target);
  const $closestLi = $heart.closest('li');
  const storyId = $closestLi.attr('id');
  const story = storyList.stories.find(s => s.storyId === storyId);
  await currentUser.deleteFavStory(story);
  $heart.closest('i').toggleClass('fas far');
}

$allStoriesList.on('click', '.fa-thin.fa-heart.fas', unmarkFave);
$favStories.on('click', '.fa-thin.fa-heart.fas', unmarkFave);


function showFavesList() {
  $favStories.empty();
  if (currentUser.favorites.length === 0) {
  $favStories.append('<h4>No favorites added!</h4>')
  }
  else {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favStories.append($story);
    }
  }
}
