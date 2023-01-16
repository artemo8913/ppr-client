import { Box, Container, Grid, Paper, Toolbar } from "@mui/material";
import Deposits from "../MuiDashboard/Deposits";
import Orders from "../MuiDashboard/Orders";
import AllPprTable from "../Dashboard/AllPprTable";
import AllDivisionsTable from "../Dashboard/AllDivisionsTable";
import CreatePpr from "../Dashboard/CreatePpr";

export default function Main() {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        marginBottom: "20px",
        overflow: "auto",
      }}
    >
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} lg={9}>
            <AllPprTable />
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 240,
              }}
            >
              <CreatePpr />
            </Paper>
          </Grid>
          {/* Recent Deposits */}
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 240,
              }}
            >
              <Deposits />
            </Paper>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <AllDivisionsTable />
          </Grid>
          {/* Recent Orders */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <Orders />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
