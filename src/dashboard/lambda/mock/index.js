(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? (module.exports = factory(require('mockjs'), require('faker'), require('cello-paginator')))
    : typeof define === 'function' && define.amd
    ? define(['mockjs', 'faker', 'cello-paginator'], factory)
    : ((global = global || self),
      (global.mock = factory(global.Mock, global.faker, global.paginator)));
})(this, function(Mock, faker, paginator) {
  'use strict';

  Mock = Mock && Mock.hasOwnProperty('default') ? Mock['default'] : Mock;
  faker = faker && faker.hasOwnProperty('default') ? faker['default'] : faker;
  paginator = paginator && paginator.hasOwnProperty('default') ? paginator['default'] : paginator;

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true,
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly)
        symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(source, true).forEach(function(key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(source).forEach(function(key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  const agents = Mock.mock({
    'data|11': [
      {
        id() {
          return Mock.Random.guid();
        },

        name() {
          return faker.company.companyName();
        },

        created_at: '@datetime',

        ip() {
          return Mock.Random.ip();
        },

        capacity() {
          return Math.ceil(Math.random() * 10);
        },

        node_capacity() {
          return Math.ceil(Math.random() * 10);
        },

        status() {
          return Mock.Random.pick(['inactive', 'active']);
        },

        log_level() {
          return Mock.Random.pick(['info', 'debug']);
        },

        type() {
          return Mock.Random.pick(['docker', 'kubernetes']);
        },

        schedulable() {
          return Mock.Random.pick([true, false]);
        },

        organization_id() {
          return Mock.Random.guid();
        },

        image() {
          return Mock.Random.pick(['financial', 'sales', 'customer', 'marketing', 'network']);
        },

        config_file: 'https://github.com/hyperledger/cello/archive/master.zip',
      },
    ],
  });

  function getAgents(req, res) {
    const { page = 1, per_page: perPage = 10 } = req.query;
    const result = paginator(agents.data, parseInt(page, 10), parseInt(perPage, 10));
    res.send({
      total: result.total,
      data: result.data,
    });
  }

  function createAgent(req, res) {
    const message = req.body;

    if (!message.capacity) {
      res.send({
        code: 20001,
        detail: 'capacity is required',
      });
    }

    if (!message.node_capacity) {
      res.send({
        code: 20001,
        detail: 'node_capacity is required',
      });
    }

    if (!message.type) {
      res.send({
        code: 20001,
        detail: 'type is required',
      });
    }

    if (!message.ip) {
      res.send({
        code: 20001,
        detail: 'ip is required',
      });
    }

    const id = Mock.Random.guid();
    agents.data.push({
      id,
      name: message.name,
      created_at: new Date(),
      ip: message.ip,
      capacity: message.capacity,
      node_capacity: message.node_capacity,
      status: 'active',
      log_level: message.log_level,
      type: message.type,
      schedulable: message.schedulable === 'true',
      organization_id: '',
      image: message.image,
      config_file:
        req.files.length > 0 ? 'https://github.com/hyperledger/cello/archive/master.zip' : '',
    });
    res.send({
      id,
    });
  }

  function getOneAgent(req, res) {
    const agent = agents.data.filter(item => item.id === req.params.id);

    if (agent.length > 0) {
      res.send(agent[0]);
    } else {
      res.send({
        code: 20005,
        detail: 'The agent not found.',
      });
    }
  }

  function updateAgentForOperator(req, res) {
    const message = req.body;
    agents.data.forEach((val, index) => {
      if (val.id === req.params.id) {
        if (message.name) {
          agents.data[index].name = message.name;
        }

        if (message.capacity) {
          agents.data[index].capacity = message.capacity;
        }

        if (message.log_level) {
          agents.data[index].log_level = message.log_level;
        }

        if (message.schedulable) {
          agents.data[index].schedulable = message.schedulable === 'true';
        }
      }
    });
    res.send({});
  }

  function updateAgentForOrgAdmin(req, res) {
    const message = req.body;
    agents.data.forEach((val, index) => {
      if (val.id === req.params.id) {
        if (message.name) {
          agents.data[index].name = message.name;
        }

        if (message.capacity) {
          agents.data[index].capacity = message.capacity;
        }

        if (message.log_level) {
          agents.data[index].log_level = message.log_level;
        }
      }
    });
    res.send({});
  }

  function applyAgent(req, res) {
    const message = req.body;

    if (!message.capacity) {
      res.send({
        code: 20001,
        detail: 'capacity is required',
      });
    }

    if (!message.type) {
      res.send({
        code: 20001,
        detail: 'type is required',
      });
    }

    agents.data.push({
      id: Mock.Random.guid(),
      name: faker.company.companyName(),
      created_at: new Date(),
      ip: Mock.Random.ip(),
      capacity: message.capacity,
      node_capacity: Math.ceil(Math.random() * 10),
      status: Mock.Random.pick(['inactive', 'active']),
      log_level: Mock.Random.pick(['info', 'debug']),
      type: message.type,
      schedulable: Mock.Random.pick([true, false]),
      organization_id: Mock.Random.guid(),
      image: Mock.Random.pick(['financial', 'sales', 'customer', 'marketing', 'network']),
      config_file: 'https://github.com/hyperledger/cello/archive/master.zip',
    });
    res.send({
      id: Mock.Random.guid(),
    });
  }

  function deleteAgent(req, res) {
    agents.data.forEach((val, index) => {
      if (val.id === req.params.id) {
        agents.data.splice(index, 1);
      }
    });
    res.send({});
  }

  function releaseAgent(req, res) {
    agents.data.forEach((val, index) => {
      if (val.id === req.params.id) {
        agents.data.splice(index, 1);
      }
    });
    res.send({});
  }

  var agent = {
    'GET /api/agents': getAgents,
    'POST /api/agents': createAgent,
    'GET /api/agents/:id': getOneAgent,
    'PUT /api/agents/:id': updateAgentForOperator,
    'PATCH /api/agents/:id': updateAgentForOrgAdmin,
    'POST /api/agents/organization': applyAgent,
    'DELETE /api/agents/:id': deleteAgent,
    'DELETE /api/agents/:id/organization': releaseAgent,
  };

  const nodes = Mock.mock({
    'data|11': [
      {
        id() {
          return Mock.Random.guid();
        },

        name() {
          return faker.company.companyName();
        },

        created_at: '@datetime',

        type() {
          return Mock.Random.pick(['ca', 'orderer', 'peer']);
        },

        network_type() {
          return Mock.Random.pick(['fabric']);
        },

        network_version() {
          return Mock.Random.pick(['1.4.2', '1.5']);
        },

        status() {
          return Mock.Random.pick([
            'deploying',
            'running',
            'stopped',
            'deleting',
            'error',
            'deleted',
          ]);
        },

        agent_id() {
          return Mock.Random.guid();
        },

        network_id() {
          return Mock.Random.guid();
        },

        ca() {
          return {
            admin_name: Mock.mock('@name'),
            admin_password: Mock.mock(/[a-z0-9]{6}/),
            hosts: [faker.company.companyName(), faker.company.companyName()],
          };
        },
      },
    ],
  });

  function getNodes(req, res) {
    const { page = 1, per_page: perPage = 10 } = req.query;
    const result = paginator(nodes.data, parseInt(page, 10), parseInt(perPage, 10));
    res.send({
      total: result.total,
      data: result.data,
    });
  }

  function registerUserToNode(req, res) {
    const message = req.body;

    if (!message.name) {
      res.send({
        code: 20001,
        detail: 'name is required',
      });
    }

    if (!message.user_type) {
      res.send({
        code: 20001,
        detail: 'user_type is required',
      });
    }

    if (!message.secret) {
      res.send({
        code: 20001,
        detail: 'secret is required',
      });
    }

    res.send({
      id: Mock.Random.guid(),
    });
  }

  function deleteNode(req, res) {
    nodes.data.forEach((val, index) => {
      if (val.id === req.params.id) {
        nodes.data.splice(index, 1);
      }
    });
    res.send({});
  }

  function operateNode(req, res) {
    const message = req.query;
    nodes.data.forEach((val, index) => {
      if (val.id === req.params.id) {
        if (message.action === 'start' || message.action === 'restart') {
          nodes.data[index].status = 'running';
        } else if (message.action === 'stop') {
          nodes.data[index].status = 'stopped';
        }
      }
    });
    res.send({});
  }

  var node = {
    'GET /api/nodes': getNodes,
    'POST /api/nodes/:id/users': registerUserToNode,
    'DELETE /api/nodes/:id': deleteNode,
    'POST /api/nodes/:id/operations': operateNode,
  };

  const organizations = Mock.mock({
    'data|11': [
      {
        id() {
          return Mock.Random.guid();
        },

        name() {
          return faker.company.companyName();
        },

        created_at: '@datetime',
      },
    ],
  });

  function getOrgs(req, res) {
    const { page = 1, per_page: perPage = 10 } = req.query;
    const result = paginator(organizations.data, parseInt(page, 10), parseInt(perPage, 10));
    res.send({
      total: result.total,
      data: result.data,
    });
  }

  var organization = {
    'GET /api/organizations': getOrgs,
  };

  const users = Mock.mock({
    'data|11': [
      {
        id() {
          return Mock.Random.guid();
        },

        username: '@name',

        role() {
          return Mock.Random.pick(['administrator', 'user']);
        },

        'organization|1': [
          {
            id() {
              return Mock.Random.guid();
            },

            name() {
              return faker.company.companyName();
            },
          },
        ],
      },
    ],
  });

  function tokenVerify(req, res) {
    const { token } = req.body;

    switch (token) {
      case 'admin-token':
        return res.json({
          token,
          user: {
            id: 'administrator',
            username: 'admin',
            role: 'operator',
            email: 'admin@cello.com',
            organization: null,
          },
        });

      case 'user-token':
        return res.json({
          token,
          user: {
            id: 'user',
            username: 'user',
            role: 'user',
            email: 'user@cello.com',
            organization: null,
          },
        });

      case 'orgAdmin-token':
        return res.json({
          token,
          user: {
            id: 'org-administrator',
            username: 'orgAdmin',
            role: 'administrator',
            email: 'administrator@cello.com',
            organization: null,
          },
        });

      default:
        return res.json({});
    }
  }

  var user = {
    'POST /api/token-verify': tokenVerify,
    '/api/users': (req, res) => {
      const { page = 1, per_page: perPage = 10 } = req.query;
      const result = paginator(users.data, parseInt(page, 10), parseInt(perPage, 10));
      res.send({
        total: result.total,
        data: result.data,
      });
    },
    'POST /api/auth': (req, res) => {
      const { password, username, type } = req.body;

      if (password === 'pass' && username === 'admin') {
        res.send({
          token: 'admin-token',
          user: {
            id: 'administrator',
            username: 'admin',
            role: 'operator',
            email: 'operator@cello.com',
            organization: null,
          },
        });
        return;
      }

      if (password === 'pass' && username === 'orgAdmin') {
        res.send({
          token: 'orgAdmin-token',
          user: {
            id: 'org-administrator',
            username: 'orgAdmin',
            role: 'administrator',
            email: 'administrator@cello.com',
            organization: null,
          },
        });
        return;
      }

      if (password === 'password' && username === 'user') {
        res.send({
          token: 'user-token',
          user: {
            id: 'user',
            username: 'user',
            role: 'user',
            email: 'user@cello.com',
            organization: null,
          },
        });
        return;
      }

      res.send({
        status: 'error',
        type,
        currentAuthority: 'guest',
      });
    },
    'GET /api/500': (req, res) => {
      res.status(500).send({
        timestamp: 1513932555104,
        status: 500,
        error: 'error',
        message: 'error',
        path: '/base/category/list',
      });
    },
    'GET /api/404': (req, res) => {
      res.status(404).send({
        timestamp: 1513932643431,
        status: 404,
        error: 'Not Found',
        message: 'No message available',
        path: '/base/category/list/2121212',
      });
    },
    'GET /api/403': (req, res) => {
      res.status(403).send({
        timestamp: 1513932555104,
        status: 403,
        error: 'Unauthorized',
        message: 'Unauthorized',
        path: '/base/category/list',
      });
    },
    'GET /api/401': (req, res) => {
      res.status(401).send({
        timestamp: 1513932555104,
        status: 401,
        error: 'Unauthorized',
        message: 'Unauthorized',
        path: '/base/category/list',
      });
    },
  };

  const data = _objectSpread2({}, agent, {}, node, {}, organization, {}, user);

  return data;
});
