
module.exports = function create() {

  var adjs = ['agreeable','alert','ambitious','boundless','brave','bright','calm','capable','cheerful','coherent','comfortable','courageous','credible','cultured','dashing','dazzling','decisive','decorous','detailed','determined','diligent','discreet','dynamic','eager','efficient','elated','eminent','enchanting','encouraging','endurable','energetic','entertaining','enthusiastic','excellent','excited','exclusive','exuberant','fabulous','fair','faithful','fantastic','fearless','fine','frank','friendly','funny','generous','gentle','glorious','good','happy','harmonious','helpful','honorable','impartial','industrious','kind','kind-hearted','knowledgeable','level','likeable','lively','lovely','lucky','mature','modern','nice','obedient','painstaking','peaceful','perfect','placid','plausible','pleasant','plucky','productive','protective','proud','punctual','quiet','reflective','relieved','resolute','responsible','rhetorical','righteous','selective','sincere','skillful','smiling','splendid','steadfast','stimulating','successful','succinct','talented','thoughtful','thrifty','tough','trustworthy','unbiased','wise','witty'];

  var nouns = ['apple','backpack','blackboard','book','bookcase','calendar','chair','chalk','chalkboard','clock','computer','desk','dictionary','eraser','map','notebook','pass','pen','pencil','protractor','textbook','whiteboard','student','teacher','educator','globe','thesaurus','calculator','playground','lunchroom','school','information'];

  function randomItem(list) {
    randIndex = Math.floor(Math.random()*list.length);
    return list[randIndex];
  }
  return randomItem(adjs) + " " + randomItem(nouns);

}; 
