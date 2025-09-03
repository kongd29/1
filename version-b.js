// version-b.js
console.log('version-b loaded');
document.addEventListener('click', (e) => {
  if (e.target?.id === 'buy-now') console.log('[B] Buy Now clicked');
  if (e.target?.id === 'add-cart') console.log('[B] Add to Cart clicked');
});
