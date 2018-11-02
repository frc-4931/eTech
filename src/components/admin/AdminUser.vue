<template>
  <div class="background-box admin-user">
    <div>
      <p>{{ user.name }}</p>
    </div>
    <div>
      <p>{{ user.username }}</p>
    </div>
    <a>Edit</a>
  </div>
</template>

<script>
export default {
  name: "AdminUser",
  props: {
    userdata: Object
  },
  data: function() {
    return {
      user: {
        name: "First Last",
        username: "Username"
      }
    };
  },
  methods: {},
  created() {
    this.$set(this.user, "username", this.teamdata["username"]);
    this.$set(this.user, "name", this.teamdata["name"]);
  }
};
</script>