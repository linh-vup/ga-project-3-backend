# Tazty Alternativez - General Assembly Project 3

[Project Overview](#project-overview) | [Getting Started](#getting-started) | [Project Brief and Timeframe](#project-brief-and-timeframe) | [Technologies Used](#technologies-used) | [Demonstration](#demonstration) | [Process](#process) | [Wins](#wins) | [Challenges](#challenges) | [Bugs & Future Improvements](#bugs--future-improvements) | [Key Learnings](#key-learnings)

# Project Overview

My third project for my General Assembly Software Engineering Immersive course was a group project where we built a complete MERN stack app. My project partners [Ellie Maitland](https://github.com/ermaitland), [Joel Sahiti](https://github.com/JoelSsssss) and I built a vegan food products review platform using Express.js, Node.js and MongoDB for the backend and React for the frontend.

**Link to deployment:** [https://tazty-alternativez.netlify.app/](https://tazty-alternativez.netlify.app/)

Test account credentials: email: `testme@testme.com`, password: `Password!1`

# Getting Started

- Clone or download the source code for the [backend](https://github.com/linh-vup/ga_project-4-backend) and [frontend](https://github.com/linh-vup/ga-project-3-frontend)
- In backend CLI:
  - Run `npm run dev`
- In frontend CLI
  - Install node modules with `npm i`
  - Run `npm start`

# Project Brief and Timeframe

We were given one week to build a MERN stack app (own backend and frontend). The backend had to have at least two models, while the frontend had to have multiple components.

# Technologies Used

- JavaScript (ES6)
- React
- Express.js
- Node.js
- MongoDB
- HTML5, CSS, Sass
- MUI
- Axios
- JWT
- Bcrypt
- Cloudinary
- Postman
- Git/GitHub
- Excalidraw
- Figma
- Trello

# Demonstration

![Project Walkthrough](./src/assets/project_walkthrough1.gif 'Project Walkthrough')
![Project Walkthrough - Reviews](./src/assets/review_walkthrough.gif 'Project Walkthrough  - Reviews')
![Screenshot - Edit Product Information](./src/assets/edit_product.png 'Screenshot - Edit Product Information')  
_Screenshot: Editing Product_  
![Screenshot - Edit Categories Information](./src/assets/edit_categories.png 'Screenshot - Edit Categories Information')  
_Screenshot: Editing Categories_  
![Screenshot - User Page](./src/assets/user_page.png 'Screenshot - User Page')  
_Screenshot: Editing Categories_

Features:

- Home page:
  - Hard coded example review
  - Product display (randomised on each load)
- Register, Log in, Log out
  - Register uses Cloudinary to upload and host user picture
  - Admin and non-admin: Some functionality only available to admin users (e.g. adding categories)
- Product index page
  - Display of all products (each displaying product image, name, band, category and overall rating)
  - Filter functionality returning products with set filter
- Product page
  - Shows product information and average rating and number of reviews
  - Creator of product can edit product details, logged in users can leave a review
  - Shows all individual user reviews
- App bar and navbar: App bar with search bar, navbar conditionally renders links based on logged in status
- Edit products, categories, brands and categories: different levels of authorisation for different types of allowed actions
- User page: Shows all users and when selected, can see their reviews

# Process

## Planning

During the holiday break before we started our project, we had decided to create a vegan food products review platform. I was planning to do Veganuary and couldn’t easily find a platform with user reviews for different vegan products, so I suggested we create one ourselves.

After reviewing some e-commerce food websites for inspiration, we discussed the features we wanted to have, as well as stretch-goals. Using Excalidraw, we created mock-ups for the app structure and notes on models and components we’d need. We then broke down individual tasks into a team Trello board and assigned them between ourselves.

![Screenshot - Excalidraw Mockup ](./src/assets/excalidraw_mockup.png 'Screenshot - Excalidraw Mockup')
![Screenshot - Planning with Trello](./src/assets/trello_board.png 'Screenshot - Planning with Trello')

## Execution

We had a stand-up on Zoom every morning to update each other on our progress, address blockers and to review tasks for the day. During the day we mostly worked on our assigned tasks individually, but kept working together on Zoom to facilitate collaboration and troubleshooting.

For both backend and frontend we did pair-programming to set up the basic folder and file structures as well as install any dependencies we knew we’d have to use. We then planned to have each of us take full ownership of a respective feature of the app for both backend and frontend, with some components being co-owned and updated, such as the router (backend) or the App.js file (frontend).

We also had regular “push and pull” sessions, where we merged our feature branches together to get the same code base and mitigate any potential merge conflicts.

While we all collaborated on most aspects of our app, my specific responsibility was to build out the Products and Categories features.

### Backend

We finished building the foundation of our backend and created models, controllers and routes for products, categories, brands, reviews and users as well as a seed file in the first two days of our project. However, we would still go back to the backend and amend it once we started on the frontend, for example to populate controllers. I also created a team workspace on Postman to easily access and test each other's endpoints.

### Featured Code Snippet:

```javascript
const getFilteredProducts = async (req, res, next) => {
  try {
    const { brands, categories } = req.query;
    const filters = [];

    if (brands) {
      filters.push({ brand: { $in: brands.split(',') } });
    }
    if (categories) {
      filters.push({ category: { $in: categories.split(',') } });
    }
    if (filters.length > 0) {
      const filteredProducts = await Product.find({
        $and: filters
      })
        .populate('category')
        .populate('brand');
      return res.status(200).json(filteredProducts);
    } else {
      const allProducts = await Product.find()
        .populate('category')
        .populate('brand');
      return res.status(200).json(allProducts);
    }
  } catch {
    error;
  }
  next(error);
};
```

This is an example backend code that I added while building the frontend to be able to filter products by category and brand. It took a while to figure out how to create a filter controller for two referenced models, but with a bit of google and stackoverflow I got it working.

### Frontend

From day 3 onwards, we started creating the frontend (after doing an install fest, where we created a basic react app and installed dependencies).

Again, I worked on the Product and Categories components, which included the following functionality:

- The product index page shows all available products and I’ve added filter functionality calling the above mentioned filter endpoint
- I’ve also added a search functionality into the navbar, where a user can search for a product and when selected, the user gets navigated to the a selected product page
- The product page displays detailed product information, including reviews.
  - The creator of the product can edit the product information
  - The page shows the average rating and number of reviews
- Add product
  - Logged in users can create a product (they have to select from available brands and categories)
- Categories page (only visible to admin)
  - Add and delete categories

### Featured Code Snippet:

```javascript
<Autocomplete
  options={query ? filteredProducts : products}
  getOptionLabel={(product) => product.name}
  onChange={(event, newValue) => {
    navigate(`/products/${newValue.id}`);
  }}
  filterOptions={(product) => product}
  renderInput={(params) => (
    <TextField
      {...params}
      onChange={(e) => {
        console.log('User is Typing', e.target.value);
        if (e.target.value !== '') {
          setQuery(e.target.value);
        } else {
          setFilteredProducts([]);
        }
      }}
      label='Search for product name or description'
    />
  )}
/>
```

Here I’m using the MUI autocomplete component for our search functionality. It was important to add the “getOptionLabel” prop here to display the product names, rather than only showing them through the “options” prop, as this way the “onChange” could access the id of the selected value to navigate the user to the correct product page.

Having worked in localisation before, a small but personally dear to me code snipped is the following, where I used a ternary operator to display copy in singular or plural form based on the number of reviews a product has

```javascript
{
  isNumberOfReviewsOne ? (
    <Typography color='text.secondary'>
      {numberOfReviews} Rating and Review
    </Typography>
  ) : (
    <Typography color='text.secondary'>
      {numberOfReviews} Ratings and Reviews
    </Typography>
  );
}
```

### Styling

After getting the main components working, I used Figma to create a more detailed design that we used as a template. We used the MUI React library a lot to easily add component styling and functionality like filter or search. Using the MUI grid system, I also made the product index and product pages responsive, with breakpoints for medium, small and very small devices

![Screenshot - Figma Mock-Up](./src/assets/trello_board.png 'Screenshot - Figma Mock-Up')

_Screenshot: Figma design mock-up for product index page_

# Wins

- Having clearly defined areas of responsibility in our planning phase and having our push and pull sessions, we didn’t have to deal with any major merge conflicts. Even when we had to incorporate our features into team member’s components, we clearly communicated and coordinated those.
- Having worked on our own feature branches through backend and frontend, I gained a lot more confidence working through a complete full stack development cycle.
- While there were some initial hiccups merging all the branches, I got a lot more confident with working in multiple feature branches.

# Challenges

- Using MUI components often felt like a blessing and a curse at the same time. Understanding which props to use could sometimes take quite a while for me to understand (e.g. the search component). How to customise and override default MUI styling still remains a mystery that I’m planning to tackle another time (see future improvements).

# Bugs & Future Improvements

- We initially planned to have functionality to save a product into a “wishlist” to display in the user’s profile, but didn’t have time to do so in the end.
- Some current flows might be confusing to a user and haven’t yet been addressed, e.g. when clicking on “users” who haven’t reviewed anything yet, there should either be a message explaining that, or a different flow to accessing other user’s reviews.
- We only had little time to spend on styling at the end of our project, so I’d invest more time to create more consistent styling, like adapting margins or styling of MUI components.
- Not all pages or components are responsive (e.g. navbar), so I’d address that too.

# Key Learnings:

- When we set up our backend together, we didn’t install all of the dependencies. This led to issues on our first day, when we ended up with duplicate installs without realising. Our instructor told us that this would usually be a part of the planning itself (which dependencies are needed and installing them for the base code). For the frontend we then planned ahead and didn’t have those issues.
- Using the Trello board and daily stand-ups really helped working in an agile environment with the team being able to prioritise important features and to quickly address any issues we had.
- Working with several people also enabled me to learn better how to work through other people’s code and seeing different approaches to solving issues.
