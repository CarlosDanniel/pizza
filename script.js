//variaveis
const c = (e)=> document.querySelector(e);
const cs = (e)=> document.querySelectorAll(e);
let modalQt = 1;
let cart = [];
let modalKey = 0;

//listagem das pizzas
pizzaJson.map((item, index) => {
	let pizzaItem = c('.models .pizza-item').cloneNode(true);
	
	pizzaItem.setAttribute('data-key', index);
	pizzaItem.querySelector('.pizza-item--img img').src = item.img;
	pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
	pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
	pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
	pizzaItem.querySelector('a').addEventListener('click', (e)=>{
		e.preventDefault();
		let key = e.target.closest('.pizza-item').getAttribute('data-key');
		modalQt = 1;
		modalKey = key;

		c('.pizzaBig img').src = pizzaJson[key].img;
		c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
		c('.pizzaInfo--size.selected').classList.remove('selected');
		cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
			size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
			if(sizeIndex == 2){
				size.classList.add('selected');
			}
		});
		c('.pizzaInfo--qt').innerHTML = modalQt;

		

		c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
		c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
		c('.pizzaWindowArea').style.opacity = 0;
		c('.pizzaWindowArea').style.display = 'flex';
		setTimeout(() => c('.pizzaWindowArea').style.opacity = 1);
	});
	c('.pizza-area').append(pizzaItem);
});

//eventos do modal
const closeModal = () => {
	c('.pizzaWindowArea').style.opacity = 0;
	setTimeout(() =>{
		c('.pizzaWindowArea').style.display = 'none'
	}, 500);
};
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>item.addEventListener('click', closeModal));

c('.pizzaInfo--qtmenos').addEventListener('click', ()=> {
	if(modalQt>1){
		modalQt--;
		c('.pizzaInfo--qt').innerHTML = modalQt;
	}
});
c('.pizzaInfo--qtmais').addEventListener('click', ()=> {
	modalQt++;
	c('.pizzaInfo--qt').innerHTML = modalQt;
});
cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
	size.addEventListener('click', (e)=>{
		c('.pizzaInfo--size.selected').classList.remove('selected');
		size.classList.add('selected');
	});
});
c('.pizzaInfo--addButton').addEventListener('click', ()=>{
	let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
	let identifier = pizzaJson[modalKey].id+'@'+size;
	let key = cart.findIndex((item)=> item.identifier == identifier);
	if (key > -1) {
		cart[key].qt+=modalQt;
	}else {
		cart.push({
			identifier,
			id:pizzaJson[modalKey].id,
			size,
			qt:modalQt
		});

	}
	updateCart();
	closeModal();
});
c('.menu-openner').addEventListener('click', ()=>{
	if (cart.length>0) {
		c('aside').style.left = '0';
	}
	c('.menu-closer').addEventListener('click', ()=>{
		c('aside').style.left = '100vw';
	});

});
function updateCart() {
	c('.menu-openner span').innerHTML = cart.length;
	if (cart.length>0) {
		c('aside').classList.add('show');
		c('.cart').innerHTML = '';
		let subtotal = 0;
		let desconto = 0;
		let total = 0;

		for(let i in cart) {

			let pizzaItem = pizzaJson.find((item)=> item.id == cart[i].id);
			subtotal+=pizzaItem.price * cart[i].qt;
			let cartItem = c('.models .cart--item').cloneNode(true);
			let pizzaSizeName;
			switch(cart[i].size){
				case 0:
					pizzaSizeName='P';
					break;
				case 1:
					pizzaSizeName='M';
					break;
				case 2:
					pizzaSizeName='G';
					break;
			}
			let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

			c('.cart').append(cartItem);
			cartItem.querySelector('img').src = pizzaItem.img;
			cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
			cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
			cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=> {
				if (cart[i].qt>1) {
					cart[i].qt--;
				} else {
					cart.splice(i, 1);
				};
				updateCart();
			});
			cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=> {
				cart[i].qt++;
				updateCart();
			});
		}
		desconto = subtotal * 0.1;
		total = subtotal - desconto;
		c('.subtotal span:last-Child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
		c('.desconto span:last-Child').innerHTML = `R$ ${desconto.toFixed(2)}`;
		c('.total span:last-Child').innerHTML = `R$ ${total.toFixed(2)}`;
	} else {
		c('aside').classList.remove('show');
		c('aside').style.left = '100vw';
	}
}
c('.slide').classList.add('invert');
function dark() {
	if (document.querySelector('.slide').classList.contains('slide-right')) {
		c('.pizza-area').classList.remove('color');
		c('.slide').classList.remove('slide-right');
		c('body').classList.remove('dark');
		c('.dark-button').classList.remove('invert');
		c('.slide').classList.remove('inv');
		c('.slide').classList.add('invert');
	}else{
		c('.pizza-area').classList.add('color');
		c('.slide').classList.add('slide-right');
		c('body').classList.add('dark');
		c('.dark-button').classList.add('invert');
		c('.slide').classList.add('inv');
		c('.slide').classList.remove('invert');
	}
}