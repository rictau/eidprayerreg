{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-24.11";
  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
  ];
  # Sets environment variables in the workspace
  env = {};
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      "dsznajder.es7-react-js-snippets"
      "dbaeumer.vscode-eslint"
      "esbenp.prettier-vscode"
    ];
    # Enable previews
    previews = {
      enable = true;
      previews = {
        web = {
          # run "npm run dev" with PORT set to IDX's defined port for previews,
          # and configure it to listen on all interfaces.
          command = [ "npm" "run" "dev" "--" "--port" "$PORT" "--host" "0.0.0.0" ];
          manager = "web";
        };
      };
    };
    # Workspace lifecycle hooks
    workspace = {
      # Runs when a workspace is first created
      onCreate = {
        # install JS dependencies from npm
        npm-install = "npm install && cd functions && npm install";
      };
      # Runs when the workspace is (re)started
      onStart = {
        # start a continuous build (e.g. emulators)
        # dev-server = "npm run dev";
      };
    };
  };
}
