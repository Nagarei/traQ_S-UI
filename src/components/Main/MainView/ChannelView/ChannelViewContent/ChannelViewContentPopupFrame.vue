<template>
  <div :class="$style.container">
    <slot></slot>
  </div>
</template>

<style lang="scss" module>
.container {
  @include background-primary;
  @include drop-shadow-default;
  display: grid;
  row-gap: 16px;
  padding: 16px;
  border-radius: 4px;
}
</style>
