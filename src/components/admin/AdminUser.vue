<template>
  <div class="background-box admin-user">
    <div>
      <p>{{ user.name }}</p>
    </div>
    <div>
      <p>{{ user.username }}</p>
    </div>
    <div>
      <p>{{ user.role }}</p>
    </div>
    <router-link :to="{name: 'user-edit', params: {username: user.username}}">Edit User</router-link>
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
        username: "Username",
        role: "None"
      }
    };
  },
  methods: {},
  created() {
    this.$set(this.user, "username", this.userdata["username"]);
    this.$set(this.user, "name", this.userdata["name"]);
    this.$set(this.user, "role", this.userdata["role"]);
  }
};
</script>