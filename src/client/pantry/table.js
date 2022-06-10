import * as crud from "./crud.js";

const new_row = document.getElementsByClassName("item_row");

const add_new_button = document.getElementById("add-new");

//if there is not yet a row, create one
//if there is a row that is not filled out then make it so that the user cannot add a new row

await crud.load_all_rows();

await crud.create_new_row("item", "quantity", "unit");
add_new_button.addEventListener("click", async function () {
  //if there exists some row that is not filled out with item, quantity, and unit, then don't add a new row
  //make unique row id to pass to crud.create_new_row

  for (let i = 0; i < new_row.length; i++) {
    //getElementsByClassName('item_name')[0].getElementsByTagName('input')[0].value;
    if (
      new_row[i]
        .getElementsByClassName("item_name")[0]
        .getElementsByTagName("input")[0].value === "" ||
      new_row[i]
        .getElementsByClassName("_Quantity")[0]
        .getElementsByTagName("input")[0].value === "" ||
      //add a check for the dropdown menu to make sure that the user has selected a unit. check if value is none
      new_row[i]
        .getElementsByClassName("dropdown")[0]
        .getElementsByTagName("select")[0].value === "none" ||
      //or class add is not present
      new_row[i].getElementsByClassName("add")[0].style.display !== "none"
    ) {
      console.log("not filled out");
      return;
    }
  }

  await crud.create_new_row("item", "quantity", "unit");
});

//get the add button that was clicked
document.addEventListener("click", async (event) => {
  const add_button = event.target.classList.contains("add");
  const edit_button = event.target.classList.contains("edit");
  const delete_button = event.target.classList.contains("delete");
  if (add_button) {
    console.log("add button clicked");
    //console log this button was clicked
    //get current row id

    //get the parent row of the button
    const parent_row = event.target.parentNode.parentNode;

    //get the item name
    const item_name = parent_row
      .getElementsByClassName("item_name")[0]
      .getElementsByTagName("input")[0].value;
    //get the quantity
    const quantity = parent_row
      .getElementsByClassName("_Quantity")[0]
      .getElementsByTagName("input")[0].value;
    //get the units
    const units = parent_row.getElementsByClassName("dropdown-units")[0].value;

    if (item_name !== "" && quantity !== "" && units !== "none") {
      makeReadOnly(parent_row);

      await crud.createRowEntry(item_name, quantity, units);
    }
  }
  if (edit_button) {
    console.log("edit button clicked");
    //get the parent row of the button
    const parent_row = event.target.parentNode.parentNode;
    //get the item name
    const item_name = parent_row
      .getElementsByClassName("item_name")[0]
      .getElementsByTagName("input")[0].value;
    //get the quantity
    const quantity = parent_row
      .getElementsByClassName("_Quantity")[0]
      .getElementsByTagName("input")[0].value;
    //get the units
    const units = parent_row.getElementsByClassName("dropdown-units")[0].value;
    //make text editable

    if (item_name !== "" && quantity !== "" && units !== "none") {
      parent_row
        .getElementsByClassName("item_name")[0]
        .getElementsByTagName("input")[0].readOnly = false;
      parent_row
        .getElementsByClassName("_Quantity")[0]
        .getElementsByTagName("input")[0].readOnly = false;
      parent_row.getElementsByClassName("dropdown-units")[0].disabled = false;
      parent_row.getElementsByClassName("add")[0].style.display = "inline";
      parent_row.getElementsByClassName("edit")[0].style.display = "inline";
      parent_row.getElementsByClassName("delete")[0].style.display = "inline";
      parent_row
        .getElementsByClassName("item_name")[0]
        .getElementsByTagName("input")[0].style.backgroundColor = "gray";
      parent_row
        .getElementsByClassName("_Quantity")[0]
        .getElementsByTagName("input")[0].style.backgroundColor = "gray";
      parent_row.getElementsByClassName(
        "dropdown-units"
      )[0].style.backgroundColor = "gray";

      //update the item in the server
      // await crud.updateRowEntry(item_name, quantity, units);
      await crud.deleteRowEntry(item_name, quantity, units);
    }
  }
  if (delete_button) {
    console.log("delete button clicked");
    //delete the row
    event.target.parentNode.parentNode.remove();
    //delete the item in the server
  }
});

document.addEventListener("keyup", function (event) {
  const item_name_listener =
    event.target.parentNode.parentNode.getElementsByClassName("item_name")[0];

  const quantity_listener =
    event.target.parentNode.parentNode.getElementsByClassName("_Quantity")[0];
  if (item_name_listener) {
    const item_name_value =
      item_name_listener.getElementsByTagName("input")[0].value;
    if (item_name_value.length > 20) {
      console.log("item name is too long");
      item_name_listener.getElementsByTagName("input")[0].value = "";
    }
  }
  if (quantity_listener) {
    const quantity_value =
      quantity_listener.getElementsByTagName("input")[0].value;
    //regex to check if input is a number and less than 4 digits
    const regex = /^[0-9]{1,5}$/;
    if (!regex.test(quantity_value)) {
      console.log("quantity is not a number");
      quantity_listener.getElementsByTagName("input")[0].value = "";
    }
  }
});

function makeReadOnly(row) {
  row
    .getElementsByClassName("item_name")[0]
    .getElementsByTagName("input")[0].readOnly = true;
  row
    .getElementsByClassName("_Quantity")[0]
    .getElementsByTagName("input")[0].readOnly = true;
  row.getElementsByClassName("dropdown-units")[0].disabled = true;
  row.getElementsByClassName("add")[0].style.display = "none";
  row.getElementsByClassName("edit")[0].style.display = "inline";
  row.getElementsByClassName("delete")[0].style.display = "inline";
  //hide textbox but only show the text

  row
    .getElementsByClassName("item_name")[0]
    .getElementsByTagName("input")[0].style.backgroundColor = "#F5F7FA";
  row
    .getElementsByClassName("_Quantity")[0]
    .getElementsByTagName("input")[0].style.backgroundColor = "#F5F7FA";
  row.getElementsByClassName("dropdown-units")[0].style.backgroundColor =
    "#F5F7FA";

  //default text color
  row.getElementsByClassName("dropdown-units")[0].style.color = "black";

  // console.log(
  //   row,
  //   "item name: " + item_name,
  //   "quantity: " + quantity,
  //   "units: " + units
  // );
}

//loop through all item_rows and call makeReadOnly
for (let i = 1; i < document.getElementsByClassName("item_row").length; i++) {
  makeReadOnly(document.getElementsByClassName("item_row")[i]);
}
