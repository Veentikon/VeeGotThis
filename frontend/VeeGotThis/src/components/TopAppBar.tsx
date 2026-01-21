import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useTheme, useMediaQuery, ToggleButton } from "@mui/material";

const navItems = [
  { label: "Todos", path: "/todos" },
  { label: "Events", path: "/events" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Profile", path: "/profile" },
  { label: "Logout", path: "/auth" }
];

export default function TopAppBar() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      {/* <AppBar position="static" elevation={4}>
        <Toolbar>
          {isMobile && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              onClick={() => setOpen(true)}
              sx={{ mr: 2, backgroundColor: "var(--primary-color)", color: "var(--bg-color)" }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {!isMobile &&
            navItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                component={Link}
                to={item.path}
              >
                {item.label}
              </Button>
            ))}
        </Toolbar>
      </AppBar> */}
      <AppBar
        position="static"
        elevation={4}
        sx={{
          backgroundColor: "var(--appbar-color)", // your CSS variable
          color: "var(--text-color)"             // ensures text/icons are visible
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              size="large"
              edge="start"
              onClick={() => setOpen(true)}
              sx={{
                mr: 2,
                backgroundColor: "var(--primary-color)",
                color: "var(--bg-color)",
                "&:hover": {
                  backgroundColor: "var(--primary-hover)"
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {!isMobile &&
            navItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  color: "var(--text-color)",
                  "&:hover": { color: "var(--primary-color)" },
                }}
              >
                {item.label}
              </Button>
            ))}
        {/* <ToggleButton value="darkMode" 
          sx={{ marginLeft: 'auto', color: 'var(--text-color)',
             height: '40px', width: ' 40px',
             backgroundColor: 'var(--primary-color)',
          }} */}
        
        {/* /> */}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: "var(--input-bg)",
            color: "var(--text-color)",
          },
        }}
      >
        <Box sx={{ width: 250 }}>
          <List>
            {navItems.map((item) => (
              <ListItem
                // button
                key={item.path}
                component={Link}
                to={item.path}
                onClick={() => setOpen(false)}
              >
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}

