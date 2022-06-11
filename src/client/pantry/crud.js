// export async function createRowEntry(item_name, quantity, unit) {
//   const response = await fetch("/pantry", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       item_name: item_name,
//       quantity: quantity,
//       units: unit,
//     }),
//   });
//   const data = await response.json();
//   return data;
// }
const table = document.getElementsByClassName("table");

export async function createRowEntry(item_name, quantity, unit) {
  const response = await fetch(
    `/pantry?item_name=${item_name}&quantity=${quantity}&units=${unit}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        item_name: item_name,
        quantity: quantity,
        units: unit,
      }),
    }
  );

  const data = await response.json();
  return data;
}

export async function deleteRowEntry(item_name) {
  const response = await fetch(`/delete?item_name=${item_name}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      item_name: item_name,
    }),
  });

  const data = await response.json();
  return data;
}

export async function readRowEntry(item_name) {
  const response = await fetch(`/read?item_name=${item_name}`);
  const data = await response.json();
  return data;
}

export async function updateRowEntry(item_name, quantity, unit) {
  const response = await fetch(`/update?item_name=${item_name}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      item_name: item_name,
      quantity: quantity,
      units: unit,
    }),
  });
  const data = await response.json();
  return data;
}

export async function getAllEntries() {
  const response = await fetch("/list");
  const data = await response.json();
  return data;
}

export async function create_new_row(item, quantity, unit) {
  const new_row = document.createElement("tr");
  new_row.className = "item_row";
  new_row.id = item;
  new_row.innerHTML = `
    
    
        <td><div class="item_name" id ="item-name"><input type="text" id="items-text" value=${item}> </div> </td>
                                <td><div class="_Quantity" id="quantity"><input type="text" id="quantity-text" value=${quantity}></div></td>
                                <td>
                                  <div class="dropdown" >
   <select class="dropdown-units">   
   <option value=${unit}>${unit}</option> 
    <option value="milliliters">milliliters</option>
    <option value="liters">liters</option>
    <option value="grams">grams</option>
    <option value="kilograms">kilograms</option>
    <option value="teaspoons">teaspoons</option>
    <option value="tablespoons">tablespoons</option>
    <option value="fluid ounces">fluid ounces</option>
    <option value="cups">cups</option>
    <option value="pints">pints</option>
    <option value="quarts">quarts</option>
    <option value="gallons">gallons</option>
    <option value="pounds">pounds</option>
    <option value="ounces">ounces</option>
    <option value="slices">slices</option>
    <option value="breasts">breasts</option>
    <option value="thighs">thighs</option>
    <option value="pieces">pieces</option>
    <option value="bunches">bunches</option>
    <option value="bundles">bundles</option>
    <option value="cans">cans</option>
    <option value="bottles">bottles</option>
    <option value="bags">bags</option>
    <option value="packets">packets</option>
    <option value="packages">packages</option>
    <option value="boxes">boxes</option>
    <option value="jars">jars</option>


       </select>
       </div>
                                </td>
                            
                                 
                                <!-- small scrollable dropdown menu -->
                                <td>
                               
                                    <img class="add" src="/images/icons8-clock-add-16.png" type="button" title="Add" ></img>
                                    <img class="edit" src="/images/icons8-cancel-last-digit-16.png" type="button"  title="Edit" ></img>
                                    <img class="delete" src="/images/icons8-empty-trash-16.png" type="button"  title="Delete"></img>
                                </td>
                                
    `;
  table[0].prepend(new_row);
}

export async function load_all_rows() {
  const all_rows = await getAllEntries();
  for (const row in all_rows) {
    const row_data = all_rows[row];
    create_new_row(row, row_data.quantity, row_data.units);
  }
}
