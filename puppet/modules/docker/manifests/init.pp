# Class: docker_service
# Ensures Docker engine and dependencies are installed and running
class docker_service {
  $docker_packages = $facts['os']['family'] ? {
    'Debian' => ['docker.io', 'curl', 'git'],
    'RedHat' => ['docker', 'curl', 'git'],
    default  => ['docker.io']
  }

  package { $docker_packages:
    ensure => installed,
  }

  service { 'docker':
    ensure     => running,
    enable     => true,
    hasstatus  => true,
    hasrestart => true,
    require    => Package[$docker_packages],
  }
}
