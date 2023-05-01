package ie.tus.introspection;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import jakarta.xml.bind.DatatypeConverter;

import java.security.MessageDigest;
import java.util.*;

@Path("/directories")
public class DirectoryResource {

    private static String calculateEtag(List<Directory> files) throws Exception {
        MessageDigest md = MessageDigest.getInstance("SHA-256");

        ObjectMapper mapper = new ObjectMapper();
        String serialized = mapper.writeValueAsString(files);

        byte[] hash = md.digest(serialized.getBytes());

        return DatatypeConverter.printHexBinary(hash);
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllDirectories(
            @QueryParam("userId") @DefaultValue("") String userId,
            @QueryParam("root") @DefaultValue("") String root,
            @QueryParam("parentId") @DefaultValue("") String parentId,
            @Context Request request
    ) {
        List<Directory> directories;

        if (!parentId.isBlank() && root.isBlank() && userId.isBlank()) {
            directories = getAllDirectoriesByParentId(parentId);
        }
        if (parentId.isBlank() && !root.isBlank() && !userId.isBlank()) {
            directories = getAllRootDirectoriesOfUser(userId, root);
        }
        DirectoryDataAccessObject ddao = DirectoryDataAccessObject.getInstance();
        directories = ddao.getAll();

        try {
            EntityTag etag = new EntityTag(calculateEtag(directories));

            // set the cache control headers for the response
            CacheControl cc = new CacheControl();
            cc.setNoCache(false);
            cc.setPrivate(true);
            cc.setMustRevalidate(true);
            cc.setMaxAge(60 * 60); // 1 hour

            // check if the client has a matching entity tag
            Response.ResponseBuilder builder = request.evaluatePreconditions(etag);
            if (builder != null) {
                // client has a matching entity tag, return a 304 Not Modified response
                return builder.cacheControl(cc).build();
            }
            // client does not have a matching entity tag, return a full response
            return Response.ok(directories).cacheControl(cc).tag(etag).build();
        } catch (Exception exception) {
            exception.printStackTrace();
            return Response.serverError().build();
        }
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
