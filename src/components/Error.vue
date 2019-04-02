<template>
  <transition enter-active-class="content-fade-in" leave-active-class="content-fade-out" mode="out-in">
    <div class="background-box content-centered">
      <h2>Error</h2>
      <p>
        <slot></slot>
      </p>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Error"
};
</script>