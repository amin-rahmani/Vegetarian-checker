function getFetch() {
  let inputVal = document.getElementById('barcode').value;

  if (inputVal.length !== 12) {
    alert(`please ensure that barcode is 12 characters`)
    return;
  }
  const url = `https://world.openfoodfacts.org/api/v0/product/${inputVal}.json`;

  fetch(url)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      // console.log(data)
      if (data.status === 1) {
        const item = new ProductInfo(data.product);
        item.showInfo();
        item.listIngredients()
      } else if (data.status !== 1) {
        alert(`Product ${inputVal} not found. Please try another.`)
      }
    })
    .catch(err => {
      console.log(`error ${err}`)
    });
}

class ProductInfo {
  constructor(productData) { // I am passing in data.product
    this.name = productData.product_name;
    this.image = productData.image_url;
    this.ingredients = productData.ingredients;
  }

  showInfo() {
    document.querySelector('#product-name').textContent = this.name;
    document.querySelector('#product-img').src = this.image;
  }


  listIngredients() {
    let tableRef = document.querySelector('#ingredient-table');
    for (let i = 1; i < tableRef.rows.length;) {
      tableRef.deleteRow(i);
    }
    if (!(this.ingredients == null)) {
      for (let key in this.ingredients) {
        let newRow = tableRef.insertRow(-1);
        let newICell = newRow.insertCell(0);
        let newVCell = newRow.insertCell(1);
        let nameStatus = this.ingredients[key].text;
        let newIText = document.createTextNode(nameStatus);
        let vegStatus = this.ingredients[key].vegetarian ? this.ingredients[key].vegetarian : 'unknown';
        let newVText = document.createTextNode(vegStatus);
        newICell.appendChild(newIText);
        newVCell.appendChild(newVText);
        if(vegStatus === 'no'){
          newVCell.classList.add('non-veg-item')
        }else if(vegStatus === 'unknown' || vegStatus === 'maybe'){
          newVCell.classList.add('unknown-veg-item')
        }
      }
    }
  }
}
// getFetch('011110038364')
// getFetch('041196910759')
// getFetch('070164008235')