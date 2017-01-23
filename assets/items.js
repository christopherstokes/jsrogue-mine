Game.ItemRepository = new Game.Repository('items', Game.Item);

Game.ItemRepository.define('apple', {
  name: 'APPLE',
  character: 'a',
  foreground: 'red',
  foodValue: 50,
  mixins: [Game.ItemMixins.Edible]
});

Game.ItemRepository.define('melon', {
  name: 'MELON',
  character: 'a',
  foreground: 'lightGreen',
  foodValue: 35,
  consumptions: 4,
  mixins: [Game.ItemMixins.Edible]
});

Game.ItemRepository.define('pumpkin', {
  name: 'PUMPKIN',
  character: 'p',
  foreground: 'orange',
  foodValue: 50,
  attackValue: 2,
  defenseValue: 2,
  wearable: true,
  wieldable: true,
  mixins: [Game.ItemMixins.Edible, Game.ItemMixins.Equippable]
});

Game.ItemRepository.define('corpse', {
  name: 'CORPSE',
  character: '%',
  foodValue: 75,
  consumptions: 1,
  mixins: [Game.ItemMixins.Edible]
}, {
  disableRandomCreation: true
});

Game.ItemRepository.define('skull', {
  name: 'SKULL',
  character: '*',
  foreground: 'white'
});

// Weapons
Game.ItemRepository.define('dagger', {
  name: 'DAGGER',
  character: ')',
  foreground: 'gray',
  attackValue: 5,
  wieldable: true,
  mixins: [Game.ItemMixins.Equippable]
}, {
  disableRandomCreation: true
});

Game.ItemRepository.define('sword', {
  name: 'SWORD',
  character: ')',
  foreground: 'white',
  attackValue: 10,
  wieldable: true,
  mixins: [Game.ItemMixins.Equippable]
}, {
  disableRandomCreation: true
});

Game.ItemRepository.define('staff', {
  name: 'STAFF',
  character: ')',
  foreground: 'yellow',
  attackValue: 5,
  defenseValue: 3,
  wieldable: true,
  mixins: [Game.ItemMixins.Equippable]
}, {
  disableRandomCreation: true
});

// Wearables
Game.ItemRepository.define('tunic', {
  name: 'TUNIC',
  character: '[',
  foreground: 'green',
  defenseValue: 2,
  wearable: true,
  mixins: [Game.ItemMixins.Equippable]
}, {
  disableRandomCreation: true
});

Game.ItemRepository.define('chainmail', {
  name: 'CHAINMAIL',
  character: '[',
  foreground: 'white',
  defenseValue: 4,
  wearable: true,
  mixins: [Game.ItemMixins.Equippable]
}, {
  disableRandomCreation: true
});

Game.ItemRepository.define('platemail', {
  name: 'PLATEMAIL',
  character: '[',
  foreground: 'aliceblue',
  defenseValue: 6,
  wearable: true,
  mixins: [Game.ItemMixins.Equippable]
}, {
  disableRandomCreation: true
});
