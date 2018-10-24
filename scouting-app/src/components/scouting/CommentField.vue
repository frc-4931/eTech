<template>
	<div class="background-box grid-perminant">
		<h2 class="location-span content-centered"> {{title}} </h2>
		<p class="location-right-giant"> {{comment}} </p>
		<p :style="color" class="location-right-tiny content-right"> {{getRating}} </p>
	</div>
</template>

<script>
//Modify so CommentField gets comment from passed in _id instead of getting data from passed in data.
//On comment submit run callback to update fields in MenuTeamView

export default {
  name: "CommentField",
  props: {
    comment: String,
    rating: Number,
    title: String
  },
  data: function() {
    return {
      color: "color: white"
    };
  },
  computed: {
    getRating: function() {
      var prefix;
      var dThis = this;
      if (this.rating > 0) {
        prefix = "+";
        dThis.color = "color: green";
      } else if (this.rating < 0) {
        prefix = "";
        dThis.color = "color: red";
      } else {
        prefix = "";
        dThis.color = "color: white";
      }
      return prefix + this.rating;
    }
  }
};
</script>
