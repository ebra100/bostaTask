import * as shell from "shelljs";

shell.mkdir("-p", "dist/public/");
shell.cp("-R", "src/public/stylesheets", "dist/public/stylesheets/");