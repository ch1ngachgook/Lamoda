import Chance from 'chance';
const chance = new Chance();

const colors = [
  'красный', 'зеленый', 'синий', 'желтый', 'фиолетовый'
];

const categories = [
  'Обувь', 'Одежда'
];

const names = [
  { name: 'Рубашка', images: ['images/shirt1.jpg', 'images/shirt2.jpg', 'images/shirt3.jpg'] },
  { name: 'Ботинки', images: ['images/shoes1.jpg', 'images/shoes2.jpg', 'images/shoes3.jpg'] },
  { name: 'Брюки', images: ['images/pants1.jpg', 'images/pants2.jpg', 'images/pants3.jpg'] },
  { name: 'Головной убор', images: ['images/cap1.jpg', 'images/cap2.jpg', 'images/cap3.jpg'] },
  { name: 'Худи', images: ['images/hoodie1.jpg', 'images/hoodie2.jpg', 'images/hoodie3.jpg'] },
];


const products = Array.from({ length: 20 }, (_, i) => {
  const nameObj = chance.pickone(names); 
  const image = chance.pickone(nameObj.images); 

  return {
    id: i + 1,
    name: nameObj.name, 
    description: chance.sentence({ words: 8 }),
    price: parseFloat(chance.integer({ min: 10, max: 1000 })),
    rating: parseFloat(chance.floating({ min: 1, max: 5, fixed: 1 })),
    color: chance.pickone(colors),
    category: chance.pickone(categories),
    image: image, 
  };
});

export const initialProducts = products;