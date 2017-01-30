var API_KEY = '0056e84483cee1825fefbcde3b37eb71';
var petsCache = [];
var currentIndex = 0;

$(document).ready(function() {

  function parsePetData(data) {
    var pet = data.petfinder.pet;
    var breeds = pet.breeds.breed;
    var photo = pet.media.photos.photo;

    if (Array.isArray(breeds)) {
      breeds = breeds.map(function(breed) {
        return breed.$t;
      });
    }
    else {
      breeds = [breeds.$t];
    }

    if (Array.isArray(photo)) {
      if (photo.some(function(photo) { return photo['@size'] === 'pn'; })) {
        photo = photo.filter(function(photo) {
          return photo['@size'] === 'pn';
        }).pop();
      }
      else {
        photo = photo.pop();
      }
    } 
    return {
      age: pet.age.$t,
      animal: pet.animal.$t,
      breeds: breeds,
      description: pet.description.$t,
      sex: pet.sex.$t,
      name: pet.name.$t,
      size: pet.size.$t,
      photo: photo.$t
    };
  }

  function showPreviousPet() {
    if (currentIndex > 0) {
      currentIndex--;
      showPet(petsCache[currentIndex]);
    }
  }

  function showNextPet() {
    if (currentIndex !== petsCache.length - 1) {
      currentIndex++;
      showPet(petsCache[currentIndex]);
    }
  }

  function showPet(pet) {
    var $randomPet = $('.random-pet');
    $randomPet.empty();

    var $img = $('<img class="image">').attr('src', pet.photo);
    $randomPet.append($img);

    var $name = $('<div class="name">Name: ' + pet.name + '<div>');
    $randomPet.append($name);

    var $animal = $('<div class="animal">Type:' + pet.animal + '<div>');
    $randomPet.append($animal);

    var $breeds = $('<div class="breeds">Breeds:' + pet.breeds.join(', ') + '<div>');
    $randomPet.append($breeds);

    // var $description = $('<div class="description">Description:' + pet.description + '<div>');
    // $randomPet.append($description);

    var $sex = $('<div class="sex">Sex:' + pet.sex + '<div>');
    $randomPet.append($sex);

    var $size = $('<div class="size">Size:' + pet.size + '<div>');
    $randomPet.append($size);

    var $age = $('<div class="age">Age:' + pet.age + '<div>');
    $randomPet.append($age);
  }

  function showNewPet(data) {
    var pet = parsePetData(data);
    petsCache.push(pet);
    currentIndex = petsCache.length - 1;

    showPet(petsCache[currentIndex]);
  }

  function getRandomPet(type) {
    $.get({
      url: 'https://api.petfinder.com/pet.getRandom',
      data: {
        key: API_KEY,
        animal: type, 
        output: 'full',
        format: 'json'
      },
      success: showNewPet,
      error: function(error) {
        console.log('error : ', error);
      },
      dataType: 'jsonp'
    });
  }

  var $randomPet = $('.random-pet');
  var $animalType = $('.pet-search-field');
  var $searchSubmit = $('.pet-search-submit');
  var $prevSubmit = $('.previous-pet-submit');
  var $nextSubmit = $('.next-pet-submit');

  $searchSubmit.on('click', function(event) {
    var animalType;
    if ($animalType.val() !== 'any') {
      animalType = $animalType.val();
    }
    getRandomPet(animalType);
  });

  $prevSubmit.on('click', function(event) {
    showPreviousPet();
  });

  $nextSubmit.on('click', function(event) {
    showNextPet();
  });

  getRandomPet();
});