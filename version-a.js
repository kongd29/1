// version-a.js
console.log('version-a loaded');
document.addEventListener('click', (e) => {
  if (e.target?.id === 'buy-now') console.log('[A] Buy Now clicked');
  if (e.target?.id === 'add-cart') console.log('[A] Add to Cart clicked');
});
