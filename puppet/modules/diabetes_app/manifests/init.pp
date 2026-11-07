# Class: diabetes_care_app
# Declaratively manages the diabetes-care container state and configuration
class diabetes_care_app (
  String $image_tag      = 'latest',
  String $container_name = 'diabetes-care-app',
  Integer $app_port      = 1012,
  String $deploy_dir     = '/opt/diabetes-care'
) {
  require docker_service

  # Ensure deployment workspace exists
  file { $deploy_dir:
    ensure => directory,
    owner  => 'root',
    group  => 'root',
    mode   => '0755',
  }

  # Ensure production env template
  file { "${deploy_dir}/.env":
    ensure  => file,
    owner   => 'root',
    group   => 'root',
    mode    => '0600',
    content => "PORT=${app_port}\nNODE_ENV=production\n",
    require => File[$deploy_dir],
  }

  # Declaratively run the application container
  exec { 'deploy_diabetes_container':
    command => "/usr/bin/docker run -d --name ${container_name} --restart unless-stopped -p ${app_port}:${app_port} diabetes-care-platform:${image_tag}",
    unless  => "/usr/bin/docker ps --filter name=^/${container_name}$ --format '{{.Names}}' | /bin/grep -w ${container_name}",
    path    => ['/usr/bin', '/bin', '/usr/local/bin'],
    require => [Service['docker'], File["${deploy_dir}/.env"]],
  }
}
