import _ from 'lodash';
import { Body, Bodies, Engine, Events, Render, World } from 'matter-js';
import { EventEmitter } from 'events';

const tableProps = {
  width: 650,
  height: 600,
  border: 200,
  scale: 0.9
};

const tableStyles = {
  top: {
    x: tableProps.width/2,
    y: -40,
    width: tableProps.width,
    height: tableProps.border
  },
  right: {
    x: tableProps.width - (tableProps.border/2 - tableProps.border * tableProps.scale),
    y: tableProps.height/2,
    width: tableProps.border,
    height: tableProps.height
  },
  bottom: {
    x: tableProps.width/2,
    y: tableProps.height,
    width: tableProps.width,
    height: tableProps.border
  },
  left: {
    x: tableProps.border/2 - tableProps.border * tableProps.scale,
    y: tableProps.height/2,
    width: tableProps.border,
    height: tableProps.height
  },
  foot: {
    x: tableProps.width/2,
    y: tableProps.height + 60,
    width: tableProps.width,
    height: tableProps.border
  },
};

const rendererProps = {
  width: tableProps.width,
  height: tableProps.height,
  showVelocity: true,
  showAxes: true
};

export default class SimulationPhysics extends EventEmitter {

  constructor(options={}) {
    super();

    this.bodies = options.table;
    this.engine = Engine.create({ enableSleeping: true });
    this.engine.world.gravity = { x: 0, y: 0 };

    this.detectCollisions = this.detectCollisions.bind(this);
    Events.on(this.engine, 'collisionStart', this.detectCollisions);
  }

  leave() {
    this.removeAllListeners();
    Events.off(this.engine);
    Engine.clear(this.engine);
  }

  render(element) {
    this.renderer = Render.create({
      element: element,
      engine: this.engine,
      options: rendererProps
    });
  }

  run() {
    if (this.renderer) {
      Render.run(this.renderer);
    };

    Engine.run(this.engine);
  }

  detectCollisions(event) {
    // NOTE maybe turn this into a sound engine with seperate props?
    _(event.pairs).each((pair) => {
      if (!pair) { return; }

      this.emit('collision', { pairs: [pair.bodyA, pair.bodyB] });
    });
  }

  addChild(physicsObj) {
    if (!physicsObj) {
      return;
    }

    World.add(this.engine.world, [ physicsObj ]);
  }

  addSensor() {
    return this.addChild(this.createSensor());
  }

  drawScene() {
    this.table = this.createTable();
    World.add(this.engine.world, this.table);
  }

  createTable() {
    return _(this.bodies).map((side) => {
      return this.createBorder(tableStyles[side]);
    }).value();
  }

  createBorder({ x, y, width, height }) {
    return Bodies.rectangle(x, y, width, height, { label: 'Table', isStatic: true });
  }

  createSensor() {
    return Bodies.rectangle(
      tableStyles.top.x,
      -160,
      tableStyles.top.width,
      tableStyles.top.height,
      {
        label: 'Sensor',
        isStatic: true,
        isSensor: true
      });
  }

}
