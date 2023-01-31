import React from 'react';
import Box from '@mui/material/Box';
import { Table, TableBody, TableCell, TableRow } from '@mui/material';

const PlayerPointDetails = ({ pointDetails }) => {
  return (
    <Box sx={{ margin: 1 }}>
      <Table size='small'>
        <TableBody>
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
                {points !== '' ? points : ' - '}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
};

export default PlayerPointDetails;
