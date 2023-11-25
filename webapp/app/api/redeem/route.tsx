// #### POST /api/user/{userId}/redeem/{rewardId} :  
// to redeem this reward for this user  
// 1- get the user points (check if they have enough points) 
// 2- deduct the points according to the reward price 
// 3- update the user points 
// 4- send an email to the user with the confirmation