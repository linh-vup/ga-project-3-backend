import { connectDb, disconnectDb } from './helpers.js';
import Brand from '../models/brand.js';
import Product from '../models/product.js';
import User from '../models/user.js';
import Category from '../models/category.js';
import Reviews from '../models/reviews.js';
console.log('📟 Running seed V4');

const ADMIN_USER = {
  username: 'admin',
  password: 'Password!1',
  email: 'admin@admin.com',
  isAdmin: true
};

const NON_ADMIN_USER = {
  username: 'nonadmin',
  password: 'Password!1',
  email: 'nonadmin@nonadmin.com'
};

const quornProducts = [
  {
    name: 'Quorn Vegan Pepperoni Slices',
    description:
      "Quorn Vegan Pepperoni is so versatile! It's simply perfect as a pizza topper and makes a delicious filling for sandwiches and wraps whether eating lunch at home or on the go. Try it on our puff pastry vegan pizzas, or in our vegan pepperoni sourdough sandwich for a delicious smokey flavour.",
    image: 'https://assets.sainsburys-groceries.co.uk/gol/8034170/1/300x300.jpg'
  },
  {
    name: 'Quorn Vegan Smoky Ham Free Slices',
    description:
      'Quorn Vegan Smoky Ham Free Slices provide a delicious vegan lunchtime option. A vegan ham free slice, with smoky overtones whilst being low in saturated fat. Add to sandwiches, salads and more for a delicious vegan meal',
    image: 'https://assets.sainsburys-groceries.co.uk/gol/7898419/1/300x300.jpg'
  },
  {
    name: 'Quorn UniQuorns - Vegan Unicorn Nuggets',
    description:
      'The ultimate vegan unicorn-shaped nuggets! High in protein and fibre and low in sat fat, our delicious vegan UniQuorns nuggets are tasty, crunchy and 100% guaranteed to please even the pickiest eater.',
    image: 'https://assets.sainsburys-groceries.co.uk/gol/8131860/1/300x300.jpg'
  },
  {
    name: 'Quorn Vegan Pieces',
    description: 'Vegan savoury flavour pieces, made with mycoprotein',
    image: 'https://assets.sainsburys-groceries.co.uk/gol/7789442/1/300x300.jpg'
  },
  {
    name: `Quorn Takeaway Crunchy Fillet Burgers`,
    description:
      'Tender vegan fillets with an amazing meat-like texture on the inside and a crunchy coating on the outside. You won’t believe is not fried chicken! Load it up with crispy lettuce, deliciously creamy mayo and slices of tomato for the ultimate vegan burger. These tasty fillet burgers are quick and easy to prepare for an epic restaurant-quality sandwich that you can make at home. Now every day is takeaway day!',
    image: 'https://assets.sainsburys-groceries.co.uk/gol/8102183/1/300x300.jpg'
  }
];

const violifeProducts = [
  {
    name: 'Violife Le Rond Camembert Flavour',
    description:
      'VIOLIFE LE ROND with Camembert flavour is soft, round and creamy. Bake it in the oven or pop it for 1’ in the microwave, pair it with dried fruits and crackers, pour a glass of wine and enjoy...',
    image: 'https://assets.sainsburys-groceries.co.uk/gol/8096897/1/300x300.jpg'
  },
  {
    name: 'Violife Greek White Block',
    description:
      'The closest thing to feta. Pure white but not as crumbly, perfect on salads and grain dishes. Perfect for a plant-based cheeseboard.',
    image: 'https://assets.sainsburys-groceries.co.uk/gol/8114922/1/300x300.jpg'
  }
];

async function seedDb() {
  // connect to the database
  console.log('🤖 Connecting to mongodb');
  await connectDb();
  console.log('🤖 Successful connection to mongodb');

  // clear the database
  console.log('Deleting all products');
  await Product.deleteMany({});
  console.log('❎ Successfully deleted products');
  console.log('Deleting all users');
  await User.deleteMany({});
  console.log('❎ Successfully deleted users... they will not be remembered');
  console.log('Deleting all Brands');
  await Brand.deleteMany({});
  console.log('❎ Successfully deleted brands');
  console.log('Deleting all Categories');
  await Category.deleteMany({});
  console.log('❎ Successfully deleted categories');
  console.log('Deleting all reviews');
  await Reviews.deleteMany({});
  console.log('❎ Successfully deleted reviews');

  // create the users
  const [user] = await User.create([NON_ADMIN_USER, ADMIN_USER]);
  console.log('👓 Successfully created admin user with id', user._id);
  // console.log(`user id is ${user._id}`);

  //create food catagory 'Cheeze'
  console.log('Creating catagory Cheeze');
  const categoryCheeze = await Category.create({ name: 'Cheeze' });
  console.log('🥪cheezes made', categoryCheeze._id);

  //create food catagory 'Meatz'
  console.log('Creating catagory Meatz');
  const categoryMeatz = await Category.create({ name: 'Meatz' });
  console.log('🥩meatz made', categoryMeatz._id);

  // create Quorn Brand
  console.log('Creating Quorn brand');
  const quornBrand = await Brand.create({ name: 'Quorn' });
  console.log('🍜 Created Quorn brand', quornBrand._id);

  // create Quorn Products
  const updatedQuornProducts = quornProducts.map((product) => ({
    ...product,
    addedBy: user._id,
    brand: quornBrand._id,
    category: categoryMeatz._id
  }));

  const quornProductsFromDb = await Product.create(updatedQuornProducts);

  await Brand.findOneAndUpdate(
    { _id: quornBrand._id },
    { $push: { products: quornProductsFromDb.map((b) => b._id) } }
  );

  await Category.findOneAndUpdate(
    { _id: categoryCheeze._id },
    { $push: { products: quornProductsFromDb.map((b) => b._id) } }
  );

  // create Violife Brand
  console.log('Creating Violife Vegan brand');
  const violifeBrand = await Brand.create({ name: 'Violife' });
  console.log('🍔 Created Violife Vegan brand', violifeBrand._id);

  // create Violife vegan Products
  const updatedViolifeProducts = violifeProducts.map((product) => ({
    ...product,
    addedBy: user._id,
    brand: violifeBrand._id,
    category: categoryCheeze._id
  }));

  const violifeProductsFromDb = await Product.create(updatedViolifeProducts);

  await Brand.findOneAndUpdate(
    { _id: violifeBrand._id },
    { $push: { products: violifeProductsFromDb.map((b) => b._id) } }
  );

  await Category.findOneAndUpdate(
    { _id: categoryMeatz._id },
    { $push: { products: violifeProductsFromDb.map((b) => b._id) } }
  );

  await disconnectDb();
  console.log('🤖 Successfully disconnected from mongodb');
}

seedDb();
