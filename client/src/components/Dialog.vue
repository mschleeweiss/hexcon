<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header"> default header </slot>
          </div>

          <div class="modal-body">
            <slot name="body"> default body </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer"> </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Dialog',
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.modal-container {
  width: 360px;
  margin: 0px auto;
  background-color: $background;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}
.modal-header {
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background: $current-line;
  color: $foreground;
  box-shadow: 0 5px 10px 0 rgb(0 0 0 / 15%);
  border-radius: 4px 4px 0px 0px;
  font-weight: 900;
}
.modal-body {
  padding: 1rem;
}
.modal-footer {
  padding: 0.5rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-shadow: 0 5px 10px 0 rgb(0 0 0 / 15%);
}
/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */
.modal-enter {
  opacity: 0;
}
.modal-leave-active {
  opacity: 0;
}
.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
