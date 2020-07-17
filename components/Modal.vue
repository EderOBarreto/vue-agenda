<template>
  <div v-show="modalIsOpen" class="calendar-modal" @click.self="closeModal">
    <div class="container">
      <div class="header"><button @click="closeModal">X</button></div>
      <div class="content"><slot /></div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
class Modal extends Vue {
  modalIsOpen = false

  openModal() {
    this.modalIsOpen = true
  }

  closeModal() {
    this.modalIsOpen = false
  }
}

export default Modal
</script>

<style lang="scss" scoped>
.calendar-modal {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(black, 0.7);
  display: grid;
  justify-items: center;
  align-items: center;
}

.calendar-modal > .container {
  background-color: white;
  border-radius: 5px;
  padding: 5px;
}
</style>
