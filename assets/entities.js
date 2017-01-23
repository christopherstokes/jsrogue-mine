// Player template
Game.PlayerTemplate = {
  name: 'YOU',
  character: '@',
  foreground: 'white',
  maxHp: 30,
  attackValue: 10,
  sightRadius: 6,
  inventorySlots: 22,
  mixins: [Game.EntityMixins.PlayerActor,
    Game.EntityMixins.Attacker, Game.EntityMixins.Destructible,
    Game.EntityMixins.InventoryHolder, Game.EntityMixins.FoodConsumer,
    Game.EntityMixins.Sight, Game.EntityMixins.MessageRecipient,
    Game.EntityMixins.Equipper,
    Game.EntityMixins.ExperienceGainer, Game.EntityMixins.PlayerStatGainer
  ]
};

// Create our central entity repository
Game.EntityRepository = new Game.Repository('entities', Game.Entity);

Game.EntityRepository.define('fungus', {
  name: 'FUNGUS',
  character: 'f',
  foreground: 'green',
  maxHp: 10,
  speed: 250,
  mixins: [Game.EntityMixins.FungusActor, Game.EntityMixins.Destructible,
    Game.EntityMixins.ExperienceGainer, Game.EntityMixins.RandomStatGainer
  ]
});

Game.EntityRepository.define('bat', {
  name: 'BAT',
  character: 'b',
  foreground: 'white',
  maxHp: 7,
  attackValue: 3,
  sightRadius: 3,
  speed: 2000,
  tasks: ['hunt', 'wander'],
  mixins: [Game.EntityMixins.TaskActor, Game.EntityMixins.Sight,
    Game.EntityMixins.Attacker, Game.EntityMixins.Destructible,
    Game.EntityMixins.CorpseDropper,
    Game.EntityMixins.ExperienceGainer, Game.EntityMixins.RandomStatGainer
  ]
});

Game.EntityRepository.define('newt', {
  name: 'NEWT',
  character: 'n',
  foreground: 'yellow',
  maxHp: 5,
  attackValue: 3,
  mixins: [Game.EntityMixins.TaskActor,
    Game.EntityMixins.Attacker, Game.EntityMixins.Destructible,
    Game.EntityMixins.CorpseDropper,
    Game.EntityMixins.ExperienceGainer, Game.EntityMixins.RandomStatGainer
  ]
});

Game.EntityRepository.define('kobold', {
  name: 'KOBOLD',
  character: '&',
  foreground: 'white',
  maxHp: 10,
  attackValue: 4,
  sightRadius: 5,
  tasks: ['hunt', 'wander'],
  mixins: [Game.EntityMixins.TaskActor, Game.EntityMixins.Sight,
    Game.EntityMixins.Attacker, Game.EntityMixins.Destructible,
    Game.EntityMixins.CorpseDropper,
    Game.EntityMixins.ExperienceGainer, Game.EntityMixins.RandomStatGainer
  ]
});

Game.EntityRepository.define('giant zombie', {
  name: 'GIANT ZOMBIE',
  character: 'z',
  foreground: 'teal',
  maxHp: 50,
  attackValue: 8,
  defenseValue: 5,
  level: 5,
  sightRadius: 6,
  mixins: [Game.EntityMixins.GiantZombieActor, Game.EntityMixins.Sight,
    Game.EntityMixins.Attacker, Game.EntityMixins.Destructible,
    Game.EntityMixins.CorpseDropper,
    Game.EntityMixins.ExperienceGainer
  ]
}, {
  disableRandomCreation: true
});

Game.EntityRepository.define('slime', {
  name: 'SLIME',
  character: '$',
  foreground: 'lightGreen',
  maxHp: 10,
  attackValue: 5,
  sightRadius: 3,
  tasks: ['hunt', 'wander'],
  mixins: [Game.EntityMixins.TaskActor, Game.EntityMixins.Sight,
    Game.EntityMixins.Attacker, Game.EntityMixins.Destructible,
    Game.EntityMixins.CorpseDropper,
    Game.EntityMixins.ExperienceGainer, Game.EntityMixins.RandomStatGainer
  ]
});
