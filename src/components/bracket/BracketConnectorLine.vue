<template>
  <div class="bracket-hor-container">
    <div class="bracket-hor-line" />
  </div>
</template>

<script>
export default {
  name: "BracketConnectorLine"
};
</script>

<style>
.bracket-hor-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.bracket-hor-line {
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) calc(50% - 1px),
    var(--neutral) calc(50%),
    rgba(0, 0, 0, 0) calc(50% + 1px)
  );

  padding-top: 10px;
  padding-bottom: 10px;
}
</style>
