import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Container } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import PlayerRow from '../components/PlayerRow';

import { getPoints } from '../lib/sheets';

const StyledTableHeaderCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
    },
}));

const LigaPage = ({ players }) => {
    const rows = players
        .sort((a, b) => (parseInt(a.poeni) < parseInt(b.poeni) ? 1 : -1))
        .map((player) => <PlayerRow key={player.ime} player={player}></PlayerRow>);
    return (
        <Box display="flex" justifyContent="center" alignItems="center" marginTop={'2em'}>
            <Container>
                <TableContainer component={Paper}>
                    <Table size="small" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <StyledTableHeaderCell>Igrac</StyledTableHeaderCell>
                                <StyledTableHeaderCell align="right">Ukupno Poena</StyledTableHeaderCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{rows}</TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </Box>
    );
};

export async function getServerSideProps(context) {
    const players = await getPoints();
    return {
        props: {
            players: players.slice(1, players.length),
        },
    };
}

export default LigaPage;
