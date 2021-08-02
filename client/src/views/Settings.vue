<template>
  <div>
    <h1 class="hc-nova">Settings</h1>
    <form @submit.prevent="">
        <label for="fname">Nickname</label>
        <input type="text" v-model="username" @keyup.enter="onPressOK" />
      </form>
  </div>
</template>
