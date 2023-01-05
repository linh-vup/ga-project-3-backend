import { connectDb, disconnectDb } from './helpers.js';
import Brand from '../models/brand.js';
import Product from '../models/product.js';
import User from '../models/user.js';
import Category from '../models/category.js';
import Reviews from '../models/reviews.js';

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

const wholeFoodsProducts = [
  {
    name: 'Veggie Taco',
    description: 'What it sounds like',
    image:
      'https://www.inspiredtaste.net/wp-content/uploads/2016/10/Veggie-Tacos-Recipe-6.jpg'
  },
  {
    name: 'Vegan Bacon',
    description:
      'No animals were harmed in the making of this product, only your health',
    image:
      'https://veganwithgusto.com/wp-content/uploads/2022/03/vegan-bacon-slices-on-plate.jpg'
  },
  {
    name: 'Water',
    description: 'Max vegan',
    image:
      'https://media.wired.com/photos/59548baa5578bd7594c464f5/master/pass/GettyImages-200218465-002_web.jpg'
  },
  {
    name: 'Vegan Pancakes',
    description: 'Very fluffy',
    image:
      'https://food-images.files.bbci.co.uk/food/recipes/vegan_american_pancakes_76094_16x9.jpg'
  },
  {
    name: `Apple`,
    description: 'No evil snake included',
    image: 'https://www.collinsdictionary.com/images/full/apple_158989157.jpg'
  }
];

const burgerKingVeganProducts = [
  {
    name: 'Vegan Burrito',
    description: 'Has no animal products... I think',
    image:
      'https://cdn.shopify.com/s/files/1/1718/7795/articles/Veggie_Burrito.jpg?v=1616586045'
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
  console.log('❎ Successfully deleted creviews');

  // create the users
  const [user, adminUser] = await User.create([NON_ADMIN_USER, ADMIN_USER]);
  console.log('👓 Successfully created admin user with id', user._id);

  // create WholeFoods Brands
  console.log('Creating whole foods brand');
  const wholeFoodsBrand = await Brand.create({ name: 'WholeFoods' });
  console.log('🍜 Created WholeFoods brand', wholeFoodsBrand._id);

  //create food catagory
  console.log('Creating catagory cheezes');
  const categoryCheeze = await Category.create({ name: 'Cheeze' });
  console.log('🥪cheezes made', categoryCheeze._id);

  //create food catagory
  console.log('Creating catagory Meatz');
  const categoryMeatz = await Category.create({ name: 'Meatz' });
  console.log('🥩meatz made', categoryMeatz._id);

  // create WholeFoods Products
  const updatedWholeFoodsProducts = wholeFoodsProducts.map((product) => ({
    ...product,
    addedBy: user._id,
    brand: wholeFoodsBrand._id,
    category: categoryCheeze._id
  }));

  const wholeFoodsProductsFromDb = await Product.create(
    updatedWholeFoodsProducts
  );

  await Brand.findOneAndUpdate(
    { _id: wholeFoodsBrand._id },
    { $push: { products: wholeFoodsProductsFromDb.map((b) => b._id) } }
  );

  await Category.findOneAndUpdate(
    { _id: categoryCheeze._id },
    { $push: { products: wholeFoodsProductsFromDb.map((b) => b._id) } }
  );

  //Burger King vegan
  console.log('Creating Burger King Vegan brand');
  const burgerKingBrand = await Brand.create({ name: 'Burger King Vegan' });
  console.log('🍔 Burger King Vegan bran', burgerKingBrand._id);
  console.log(`user id is ${user._id}`);

  // create Burger King vegan Products
  const updatedburgerKingVeganProducts = burgerKingVeganProducts.map(
    (product) => ({
      ...product,
      addedBy: user._id,
      brand: burgerKingBrand._id,
      category: categoryMeatz._id
    })
  );

  const burgerKingVeganProductsFromDb = await Product.create(
    updatedburgerKingVeganProducts
  );

  await Brand.findOneAndUpdate(
    { _id: burgerKingBrand._id },
    { $push: { products: burgerKingVeganProductsFromDb.map((b) => b._id) } }
  );

  await Category.findOneAndUpdate(
    { _id: categoryMeatz._id },
    { $push: { products: burgerKingVeganProductsFromDb.map((b) => b._id) } }
  );

  await disconnectDb();
  console.log('🤖 Successfully disconnected from mongodb');
}

seedDb();
