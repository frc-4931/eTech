<template>
  <div class="grid-perminant">
    <div class="location-span background-box">
      <h2 class="content-centered">Hello, {{ user.username != null ? user.username : "ERROR" }}!</h2>
      <p>
        In the account menu you can change your password and see your account
        permissions.
      </p>
    </div>

    <div class="location-span background-box">
      <h2 class="content-centered">Permissions</h2>

      <div class="account-info-permission" :class="hasPermissionClass(hasView)">
        <i class="material-icons">{{ hasPermissionIcon(hasView) }}</i>

        <p>You can view data collected by team members and from The Blue Alliance.</p>
      </div>

      <div class="account-info-permission" :class="hasPermissionClass(hasEdit)">
        <i class="material-icons">{{ hasPermissionIcon(hasEdit) }}</i>

        <p>You can add, edit and remove data.</p>
      </div>

      <div class="account-info-permission" :class="hasPermissionClass(hasAdmin)">
        <i class="material-icons">{{ hasPermissionIcon(hasAdmin) }}</i>

        <p>You can access the Admin Tools to add users, edit scouting templates and more</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AccountInfo",
  props: {
    user: Object,
    hasView: false,
    hasEdit: false,
    hasAdmin: false
  },
  watch: {
    user: {
      handler(newValue, oldValue) {
        this.updatePermissions();
      },
      deep: true
    }
  },
  methods: {
    updatePermissions() {
      this.hasAdmin = this.user.role == "_admin";
      this.hasEdit = this.hasAdmin || this.user.role == "edit";
      this.hasView = this.hasEdit || this.user.role == "view";
    },
    hasPermissionIcon(hasPermission) {
      return hasPermission ? "check" : "clear";
    },
    hasPermissionClass(hasPermission) {
      return hasPermission
        ? "account-info-has-permission"
        : "account-info-no-permission";
    }
  },
  created() {
    this.updatePermissions();
  }
};
</script>

<style>
.account-info-permission {
  display: grid;
  grid-template-columns: 32px 1fr;
}
.account-info-has-permission i {
  color: var(--positive);
}
.account-info-no-permission p {
  color: var(--neutral);
}
.account-info-no-permission i {
  color: var(--negative);
}
</style>