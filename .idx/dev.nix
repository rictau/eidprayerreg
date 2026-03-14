{ pkgs, ... }:
{
  # Which nixpkgs channel to use.
  channel = "unstable"; # Using unstable to get the latest nodejs
  # Use https://search.nixos.org/packages to find packages
  packages = [ pkgs.nodejs ]; # This will pull the latest nodejs version from the channel
  # Sets environment variables in the workspace
  env = {};
}