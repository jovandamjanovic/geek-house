import React from "react";
import Box from "@mui/material/Box";
import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const PlayerPointDetails = ({ pointDetails }) => {
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const half = Math.ceil(pointDetails.length / 2);

  return (
    <Box sx={{ margin: 1 }}>
      <Table size="small">
        <TableBody>
          {smallScreen ? (
            <>
              <TableRow>
                <TableCell>Kolo</TableCell>
                {pointDetails.slice(0, half).map((_, index) => (
                  <TableCell key={`kolo-index-${index}`}>{index + 1}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell>Poeni</TableCell>
                {pointDetails.slice(0, half).map((points, index) => (
                  <TableCell key={`kolo-poeni-${index}`}>
                    {points !== "" ? points : " - "}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell>Kolo</TableCell>
                {pointDetails
                  .slice(half, pointDetails.length)
                  .map((_, index) => (
                    <TableCell key={`kolo-index-${index + half}`}>
                      {index + half + 1}
                    </TableCell>
                  ))}
              </TableRow>
              <TableRow>
                <TableCell>Poeni</TableCell>
                {pointDetails.slice(half, pointDetails.length).map((points, index) => (
                  <TableCell key={`kolo-poeni-${index}`}>
                    {points !== "" ? points : " - "}
                  </TableCell>
                ))}
              </TableRow>
            </>
          ) : (
            <>
              <TableRow>
                <TableCell>Kolo</TableCell>
                {pointDetails.map((_, index) => (
                  <TableCell key={`kolo-index-${index}`}>{index + 1}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell>Poeni</TableCell>
                {pointDetails.map((points, index) => (
                  <TableCell key={`kolo-poeni-${index}`}>
                    {points !== "" ? points : " - "}
                  </TableCell>
                ))}
              </TableRow>
            </>
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default PlayerPointDetails;
