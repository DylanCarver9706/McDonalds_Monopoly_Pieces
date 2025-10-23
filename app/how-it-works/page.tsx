// "use client";

// import {
//   Container,
//   Typography,
//   Box,
//   Grid,
//   Card,
//   Paper,
//   Stepper,
//   Step,
//   StepLabel,
//   StepContent,
//   Button,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
// } from "@mui/material";
// import {
//   CheckCircle as CheckCircleIcon,
//   ArrowForward as ArrowForwardIcon,
// } from "@mui/icons-material";
// import { SignInButton } from "@clerk/nextjs";

// export default function HowItWorksPage() {
//   const steps = [
//     {
//       label: "Add Your Pieces",
//       description:
//         "Start by adding all the Monopoly pieces you have to your collection. Include the year, piece name, and where you acquired it.",
//       number: 1,
//     },
//     {
//       label: "Search for Missing Pieces",
//       description:
//         "Browse through property sets to find the pieces you need to complete your collections. Each piece shows who has it available.",
//       number: 2,
//     },
//     {
//       label: "Connect with Other Players",
//       description:
//         "Click on any piece to see all players who have it, then start a chat to negotiate trades, splits, or sales.",
//       number: 3,
//     },
//     {
//       label: "Complete Your Collections",
//       description:
//         "Trade pieces with other players to complete your property sets and win prizes together!",
//       number: 4,
//     },
//   ];

//   const benefits = [
//     "Find missing pieces quickly and easily",
//     "Connect with players who have what you need",
//     "Secure trading with verified users",
//     "Real-time chat for instant negotiations",
//     "Complete collections and win prizes together",
//   ];

//   const tradingExamples = [
//     { piece: "Boardwalk", section: "Dark Blue", rarity: "Rare", players: 12 },
//     { piece: "Park Place", section: "Dark Blue", rarity: "Rare", players: 8 },
//     {
//       piece: "Marvin Gardens",
//       section: "Yellow",
//       rarity: "Common",
//       players: 45,
//     },
//     {
//       piece: "Ventnor Avenue",
//       section: "Yellow",
//       rarity: "Common",
//       players: 38,
//     },
//   ];

//   return (
//     <Box>
//       {/* Hero Section */}
//       <Box
//         sx={{
//           background:
//             "linear-gradient(135deg, #667eea 0%, rgb(71, 94, 194) 100%)",
//           color: "white",
//           py: 8,
//         }}
//       >
//         <Container maxWidth="lg">
//           <Typography
//             variant="h2"
//             component="h1"
//             textAlign="center"
//             gutterBottom
//             sx={{ fontWeight: "bold" }}
//           >
//             How Monopoly McTrade Works
//           </Typography>
//           <Typography variant="h5" textAlign="center" sx={{ opacity: 0.9 }}>
//             Connect with other players to trade McDonald's Monopoly property pieces and
//             complete your collections
//           </Typography>
//         </Container>
//       </Box>

//       {/* Method Explanation */}
//       <Box sx={{ backgroundColor: "#f8fafc", py: 8 }}>
//         <Container maxWidth="lg">
//           <Grid
//             container
//             spacing={6}
//             alignItems="flex-start"
//             justifyContent="center"
//           >
//             <Grid item xs={12} md={7} sx={{ textAlign: "center" }}>
//               <Typography
//                 variant="h6"
//                 color="text.secondary"
//                 sx={{ mb: 4, maxWidth: 520, mx: "auto", textAlign: "center" }}
//               >
//                 Monopoly McTrade is the ultimate platform for McDonald's
//                 Monopoly piece trading. Connect with other players, find missing
//                 pieces, and complete your property sets to win amazing prizes
//                 together!
//               </Typography>

//               <Box sx={{ mt: 4, textAlign: "center" }}>
//                 <SignInButton mode="modal">
//                   <Button
//                     variant="contained"
//                     size="large"
//                     endIcon={<ArrowForwardIcon />}
//                     sx={{ mr: 2 }}
//                   >
//                     Start Trading Pieces
//                   </Button>
//                 </SignInButton>
//               </Box>
//             </Grid>

//             <Grid item xs={12} md={5}>
//               <Typography
//                 variant="h6"
//                 gutterBottom
//                 sx={{ textAlign: { xs: "center", md: "left" } }}
//               >
//                 Why Monopoly McTrade Works:
//               </Typography>
//               <List
//                 sx={{ px: 0, m: 0, maxWidth: 520, mx: { xs: "auto", md: 0 } }}
//               >
//                 {benefits.map((benefit, index) => (
//                   <ListItem key={index} sx={{ px: 0 }}>
//                     <ListItemIcon sx={{ minWidth: 32 }}>
//                       <CheckCircleIcon color="primary" />
//                     </ListItemIcon>
//                     <ListItemText primary={benefit} />
//                   </ListItem>
//                 ))}
//               </List>
//             </Grid>
//           </Grid>
//         </Container>
//       </Box>

//       {/* Step-by-Step Process */}
//       <Box
//         sx={{
//           background:
//             "linear-gradient(135deg, #667eea 0%, rgb(71, 94, 194) 100%)",
//           py: 8,
//         }}
//       >
//         <Container maxWidth="lg">
//           <Typography
//             variant="h3"
//             component="h2"
//             textAlign="center"
//             gutterBottom
//             sx={{ color: "white" }}
//           >
//             The 4-Step Trading Process
//           </Typography>
//           <Typography
//             variant="h6"
//             textAlign="center"
//             sx={{ mb: 6, color: "rgba(255,255,255,0.85)" }}
//           >
//             Follow these steps to start trading Monopoly pieces
//           </Typography>

//           <Box sx={{ display: "flex", justifyContent: "center" }}>
//             <Stepper
//               orientation="vertical"
//               sx={{
//                 maxWidth: 720,
//                 width: "100%",
//                 mx: "auto",
//                 "& .MuiStepLabel-label": { color: "rgba(255,255,255,0.9)" },
//                 "& .MuiStepLabel-label.Mui-active": { color: "#fff" },
//                 "& .MuiStepConnector-line": {
//                   borderColor: "rgba(255,255,255,0.35)",
//                 },
//               }}
//             >
//               {steps.map((step, index) => (
//                 <Step key={index} active={true}>
//                   <StepLabel
//                     StepIconComponent={() => (
//                       <Box
//                         sx={{
//                           width: 24,
//                           height: 24,
//                           // borderRadius: "50%",
//                           backgroundColor: "white",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           color: "#475ec2",
//                           fontWeight: 800,
//                           fontSize: "1rem",
//                         }}
//                       >
//                         {step.number}
//                       </Box>
//                     )}
//                   >
//                     <Typography variant="h6">{step.label}</Typography>
//                   </StepLabel>
//                   <StepContent>
//                     <Typography sx={{ mb: 2, color: "rgba(255,255,255,0.85)" }}>
//                       {step.description}
//                     </Typography>
//                   </StepContent>
//                 </Step>
//               ))}
//             </Stepper>
//           </Box>
//         </Container>
//       </Box>

//       <Box sx={{ backgroundColor: "#f8fafc", py: 8 }}>
//         <Container maxWidth="lg">
//           <Typography
//             variant="h3"
//             component="h2"
//             textAlign="center"
//             gutterBottom
//           >
//             Trading vs Going Solo
//           </Typography>
//           <Typography
//             variant="h6"
//             textAlign="center"
//             color="text.secondary"
//             sx={{ mb: 6 }}
//           >
//             See how trading with other players helps you complete collections
//             faster
//           </Typography>

//           <Grid container spacing={4}>
//             <Grid item xs={12} md={6}>
//               <Card sx={{ p: 3, height: "100%" }}>
//                 <Typography variant="h5" gutterBottom>
//                   Going Solo: Collecting Alone
//                 </Typography>
//                 <Typography color="text.secondary" sx={{ mb: 5 }}>
//                   Try to collect all pieces yourself without trading with other
//                   players.
//                 </Typography>
//                 <Typography variant="h6" mb={2} gutterBottom>
//                   Limited to your own purchases
//                 </Typography>
//                 <TableContainer component={Paper} sx={{ mb: 2 }}>
//                   <Table size="small" aria-label="solo collecting">
//                     <TableHead>
//                       <TableRow>
//                         <TableCell>Property</TableCell>
//                         <TableCell align="left">Section</TableCell>
//                         <TableCell align="right">Rarity</TableCell>
//                         <TableCell align="right">Players</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {tradingExamples.map((example, index) => (
//                         <TableRow key={index}>
//                           <TableCell>{example.piece}</TableCell>
//                           <TableCell align="left">{example.section}</TableCell>
//                           <TableCell align="right">{example.rarity}</TableCell>
//                           <TableCell align="right">Just You</TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               </Card>
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <Card sx={{ p: 3, height: "100%" }}>
//                 <Typography variant="h5" gutterBottom color="primary">
//                   Monopoly McTrade: Connect & Trade
//                 </Typography>
//                 <Typography color="text.secondary" sx={{ mb: 2 }}>
//                   Find other players who have the pieces you need and trade for
//                   the pieces they want. Everyone wins!
//                 </Typography>
//                 <Typography variant="h6" mb={2} gutterBottom>
//                   Access to all players' collections
//                 </Typography>
//                 <TableContainer component={Paper} sx={{ mb: 2 }}>
//                   <Table size="small" aria-label="trading network">
//                     <TableHead>
//                       <TableRow>
//                         <TableCell>Property</TableCell>
//                         <TableCell align="left">Section</TableCell>
//                         <TableCell align="right">Rarity</TableCell>
//                         <TableCell align="right">Players</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {tradingExamples.map((example, index) => (
//                         <TableRow key={index}>
//                           <TableCell>{example.piece}</TableCell>
//                           <TableCell align="left">{example.section}</TableCell>
//                           <TableCell align="right">{example.rarity}</TableCell>
//                           <TableCell align="right">{example.players}</TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               </Card>
//             </Grid>
//           </Grid>
//         </Container>
//       </Box>

//       {/* CTA Section */}
//       <Box
//         sx={{
//           background:
//             "linear-gradient(135deg, #667eea 0%, rgb(71, 94, 194) 100%)",
//           color: "white",
//           py: 8,
//         }}
//       >
//         <Container maxWidth="md" sx={{ textAlign: "center" }}>
//           <Typography variant="h4" component="h2" gutterBottom>
//             Ready to Start Trading?
//           </Typography>
//           <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
//             Join Monopoly McTrade and connect with other players to complete
//             your McDonald's Monopoly collections and win amazing prizes!
//           </Typography>
//           <SignInButton mode="modal">
//             <Button
//               variant="contained"
//               size="large"
//               sx={{
//                 backgroundColor: "white",
//                 color: "primary.main",
//                 px: 6,
//                 py: 2,
//                 fontSize: "1.1rem",
//                 "&:hover": {
//                   backgroundColor: "grey.100",
//                 },
//               }}
//             >
//               Start Trading Pieces
//             </Button>
//           </SignInButton>
//         </Container>
//       </Box>
//     </Box>
//   );
// }
