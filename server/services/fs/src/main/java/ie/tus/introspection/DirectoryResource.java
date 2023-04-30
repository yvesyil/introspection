package ie.tus.introspection;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import java.util.*;

@Path("/directories")
public class DirectoryResource {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Directory> getAllDirectories(
            @QueryParam("userId") @DefaultValue("") String userId,
            @QueryParam("root") @DefaultValue("") String root,
            @QueryParam("parentId") @DefaultValue("") String parentId
    ) {
        if (!parentId.isBlank() && root.isBlank() && userId.isBlank()) {
            return getAllDirectoriesByParentId(parentId);
        }
        if (parentId.isBlank() && !root.isBlank() && !userId.isBlank()) {
            return getAllRootDirectoriesOfUser(userId, root);
        }
        DirectoryDataAccessObject ddao = DirectoryDataAccessObject.getInstance();
        return ddao.getAll();
    }

    private List<Directory> getAllDirectoriesByParentId(String parentId) {
        DirectoryDataAccessObject ddao = DirectoryDataAccessObject.getInstance();
        return ddao.getDirectoriesWhere("parentId", "int", parentId);
    }

    private List<Directory> getAllRootDirectoriesOfUser(String userId, String root) {
        DirectoryDataAccessObject ddao = DirectoryDataAccessObject.getInstance();
        List<String[]> queryParams = new ArrayList<>();
        queryParams.add(new String[] {"userId", "int", userId});
        queryParams.add(new String[] {"root", "boolean", root});
        return ddao.getDirectoriesWhere(queryParams);
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{id}")
    public Directory getDirectory(@PathParam("id") String id) {
        DirectoryDataAccessObject ddao = DirectoryDataAccessObject.getInstance();
        return ddao.get(Integer.parseInt(id));
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response postDirectory(Directory directory) {
        DirectoryDataAccessObject ddao = DirectoryDataAccessObject.getInstance();
        Map<String, Object> body = new HashMap<>();
        Response.Status status;
        if (ddao.add(directory)) {
            body.put("message", "Directory created");
            body.put("success", true);
            status = Response.Status.CREATED;
        } else {
            body.put("message", "Could not create directory");
            body.put("success", false);
            status = Response.Status.BAD_REQUEST;
        }
        return Response.status(status).entity(body).build();
    }

    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("{id}")
    public Response putDirectory(@PathParam("id") String id, Directory updatedDirectory) {
        DirectoryDataAccessObject ddao = DirectoryDataAccessObject.getInstance();
        Map<String, Object> body = new HashMap<>();
        Response.Status status;
        updatedDirectory.setId(Integer.parseInt(id));
        if (ddao.update(updatedDirectory)) {
            body.put("message", "Directory updated");
            body.put("success", true);
            status = Response.Status.OK;
        } else {
            body.put("message", "Could not update directory");
            body.put("success", false);
            status = Response.Status.BAD_REQUEST;
        }
        return Response.status(status).entity(body).build();
    }

    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{id}")
    public Response deleteDirectory(@PathParam("id") String id) {
        DirectoryDataAccessObject ddao = DirectoryDataAccessObject.getInstance();
        Map<String, Object> body = new HashMap<>();
        Response.Status status;
        if (ddao.remove(Integer.parseInt(id))) {
            body.put("message", "Deleted directory");
            body.put("success", true);
            status = Response.Status.OK;
        } else {
            body.put("message", "Could not delete directory");
            body.put("success", false);
            status = Response.Status.BAD_REQUEST;
        }
        return Response.status(status).entity(body).build();
    }
}
