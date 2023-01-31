import React, { useState, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Collapse } from '@mui/material';
import PlayerPointDetails from './PlayerPointDetails';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const PlayerRow = ({ player: { ime, poeni, poeniPoKolu }}) => {
  const [open, setOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setOpen((open) => !open);
  }, [setOpen]);

  return (
    <>
      <StyledTableRow
        sx={{
          '&:last-child td, &:last-child th': {
            border: 0,
          },
        }}
        onClick={toggleOpen}
      >
        <StyledTableCell component='th' scope='row'>
          {ime}
        </StyledTableCell>
        <StyledTableCell align='right'>{poeni}</StyledTableCell>
      </StyledTableRow>
      <TableRow>
        <TableCell colSpan={2} style={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <PlayerPointDetails pointDetails={poeniPoKolu}/>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default PlayerRow;
