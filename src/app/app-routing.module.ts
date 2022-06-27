import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import("./modules/pages/pages.module").then((m) => m.PagesModule) },
  // { path: '', loadChildren: () => import("./modules/auth/auth.module").then((m) => m.AuthModule)},
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }