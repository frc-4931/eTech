<template>
<div id="menu-team-comment-add">
    <form class="grid" onsubmit="newCommentFromForm(this); return false;">
        <div class="location-centered-small background-box">
            <h2 class="content-centered">Add comment for <span id="comment-popup-comment-name"></span> - <span id="comment-popup-comment-number"></span></h2>
        </div>

        <div class="location-centered-small">
            <div class="background-box">
                <input type="text" name="comment-title" placeholder="Comment Title" required>
            </div>

            <div class="background-box">
                <textarea rows="10" type="text" name="comment-content" placeholder="Comment" required></textarea>
            </div>

            <div class="background-box">
                <select name="comment-points" required>
                    <option value="Invalid" selected="selected" disabled>Select Point Value for Comment</option>
                    <option value="-1">-1</option>
                    <option value="-2">-2</option>
                    <option value="0">Neutral</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                </select>
            </div>
        </div>

        <div class="location-centered-small background-box"><input type="submit"></div>

    </form>
</div>
</template>

<script>
export default {
  name: "MenuTeamCommentAdd"
};
</script>

<style>
</style>
