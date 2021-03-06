﻿using SisHair.Presentation.Web.MVC.Old.App_Start;
using System;
using System.Security.Principal;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Security;

namespace SisHair.Presentation.Web.MVC.Old
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            HtmlHelper.ClientValidationEnabled = false;
            RouteConfig.RegisterRoutes(RouteTable.Routes);

        }

        protected void Application_AuthenticateRequest(Object sender, EventArgs e)
        {
            var cookie = Context.Request.Cookies[FormsAuthentication.FormsCookieName];
            if (cookie!=null && cookie.Value != string.Empty)
            {
                FormsAuthenticationTicket tickt;
                try
                {
                    tickt = FormsAuthentication.Decrypt(cookie.Value);
                }
                catch (Exception)
                {
                    return;    
                }
                var perfis = tickt.UserData.Split(';');
                if (Context.User != null)
                {
                    Context.User = new GenericPrincipal(Context.User.Identity, perfis);
                }
            }
        }

    }
}
