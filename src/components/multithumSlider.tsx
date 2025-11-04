import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";


const minDistance = 5; // distancia mínima entre thumbs

export default function MultiThumbSlider() {
  const [values, setValues] = React.useState<number[]>([20, 40, 60, 80]);

  const handleChange = (event: Event, newValue: number[], activeThumb: number) => {
    const temp = [...newValue];
    for (let i = 1; i < temp.length; i++) {
      if (temp[i] - temp[i - 1] < minDistance) {
        if (activeThumb === i) temp[i] = temp[i - 1] + minDistance;
        else temp[i - 1] = temp[i] - minDistance;
      }
    }
    setValues(temp);
  };

  return (
    <Box sx={{ width: 300 }}>
      <Slider
        value={values}
        onChange={handleChange}
        valueLabelDisplay="auto"
        disableSwap
        min={0}
        max={100}
      />
    </Box>
  );
}
