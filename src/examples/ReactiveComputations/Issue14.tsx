let $name = "jesen";

let $width = 10;
let $height = 20;
let $area = $width * $height;

export const Issue14 = () => {
  return (
    <div>
      <div id="iss14-1">Hallo, {$name}</div>
      <div id="iss14-2">width: {$width}</div>
      <div id="iss14-3">height: {$height}</div>
      <div id="iss14-4">area: {$area}</div>
    </div>
  );
};
