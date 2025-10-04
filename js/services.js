/***********************************************************************************
 * App Services. This contains the logic of the application organised in modules/objects. *
 ***********************************************************************************/

myApp.services = {

  /////////////////
  // Task Service //
  /////////////////
  tasks: {

    // Creates a new task and attaches it to the pending task list.


    // Modifies the inner data and current view of an existing task.


    // Deletes a task item and its listeners.

  },

  /////////////////////
  // Category Service //
  ////////////////////
  categories: {

    // Creates a new category and attaches it to the custom category list.

      // Adds filtering functionality to this category item.

      // Attach the new category to the corresponding list.

    // On task creation/update, updates the category list adding new categories if needed.


    // On task deletion/update, updates the category list removing categories without tasks if needed.
 

    // Deletes a category item and its listeners.


    // Adds filtering functionality to a category item.


    // Transforms a category name into a valid id.

  },

  //////////////////////
  // Animation Service //
  /////////////////////
  animators: {

    // Swipe animation for task completion.


    // Remove animation for task deletion.

    
  },


};
