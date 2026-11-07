# Puppet Master main manifest - site.pp
# Declares target nodes and assigns role classes

node default {
  include docker_service
  include diabetes_care_app
}

node 'agent-node.local', 'agent-node' {
  include docker_service
  include diabetes_care_app
}
