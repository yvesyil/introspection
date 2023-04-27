package ie.tus.introspection;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;

@Path("/")
public class FileResource {
    @GET
    @Produces("text/plain")
    public String hello() {
        return "Hello, World!";
    }

}