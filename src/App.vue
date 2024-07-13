<script setup lang="ts">
import { ref } from "vue";
import { useItemsStore } from "./stores/items";


const HEADING = "Todo App";
const ADD_ITEM_LABEL = "Add New Item";
enum ITEM_ACTION_BUTTON_LABEL {
  ADD = "Add",
  CANCEL = "Cancel",
  COMPLETE = "Complete",
  EDIT = "Edit",
  REMOVE = "Remove",
  RESET = "Reset",
  SAVE = "Save"
}

const itemsStore = useItemsStore();
const newItemText = ref("");
const selectedItemIndex = ref(-1);
const selectedItemText = ref("");

const focusSelectedItem = (el: Element | null) => {
  if (el?.querySelector("input")) {
    (el.querySelector("input") as HTMLInputElement).focus();
  }
}

const handleNewItemInput = (event: Event) => {
  newItemText.value = (event.target as HTMLInputElement).value;
}

const handleSelectedItemInput = (event: Event) => {
  selectedItemText.value = (event.target as HTMLInputElement).value;
}

const handleAddNewItem = () => {
  if (newItemText.value.length) {
    itemsStore.addItem(newItemText.value);
    newItemText.value = "";
  }
}

const handleEditItem = (index: number) => {
  if (selectedItemText.value.length) {
    itemsStore.editItem(index, selectedItemText.value);
    selectedItemIndex.value = -1;
    selectedItemText.value = "";
  }
}

const handleRemoveItem = (index: number) => {
  if (index > -1) {
    itemsStore.removeItem(index);
  }
}

const handleSelectItem = (index: number) => {
  selectedItemIndex.value = index;
  selectedItemText.value = itemsStore.items[selectedItemIndex.value].text;
}

const handleDeselectItem = () => {
  selectedItemIndex.value = -1;
  selectedItemText.value = "";
}

const handleToggleItemStatus = (index: number) => {
  itemsStore.toggleItem(index);
}

</script>

<template>
  <h1>{{ HEADING }}</h1>
  <label>
    {{ ADD_ITEM_LABEL }}
    <input type="text" :value="newItemText" @input="handleNewItemInput" @keyup.enter="handleAddNewItem">
  </label>
  <button @click="handleAddNewItem">{{ ITEM_ACTION_BUTTON_LABEL.ADD }}</button>
  <TransitionGroup tag="ul">
    <li v-for="(item, index) in itemsStore.items" :key="index" :ref="(el) => focusSelectedItem(el as Element | null)">
      <div v-if="selectedItemIndex === index">
        <div>
          <input type="text" :value="selectedItemText" @input="handleSelectedItemInput"
            @keyup.enter="() => handleEditItem(index)" @keyup.esc="handleDeselectItem">
        </div>
        <button type="button" @click="() => handleEditItem(index)">{{ ITEM_ACTION_BUTTON_LABEL.SAVE }}</button>
        <button type="button" @click="handleDeselectItem">{{ ITEM_ACTION_BUTTON_LABEL.CANCEL }}</button>
      </div>
      <div v-else>
        <div :class="{ complete: itemsStore.items[index].completed }">{{ item.text }}</div>
        <button type="button" @click="() => handleToggleItemStatus(index)">
          {{ ITEM_ACTION_BUTTON_LABEL.COMPLETE }}</button>
        <button type="button" @click="() => handleSelectItem(index)">
          {{ ITEM_ACTION_BUTTON_LABEL.EDIT }}
        </button>
        <button @click="() => handleRemoveItem(index)">{{ ITEM_ACTION_BUTTON_LABEL.REMOVE }}</button>
      </div>
    </li>
  </TransitionGroup>
</template>

<style scoped>
.complete {
  text-decoration: line-through;
}

.v-move,
.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.v-leave-active {
  position: absolute;
}
</style>
